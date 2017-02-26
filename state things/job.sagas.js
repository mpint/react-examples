import { actions,
	RUN_JOB_SAGA, RUN_BULK_JOB_SAGA, SAVE_BULK_JOB_SAGA, JOB_STATUS_SAGA,
	KILL_JOB_SAGA, REMOVE_SAVED_JOB_SAGA, JOB_CONFIGURATION_UPDATE_SAGA,
	MODEL_PROMOTE_SAGA, MODEL_DELETE_SAGA, MODEL_METRICS_FETCH_SAGA,
	MODEL_CHARTS_FETCH_SAGA
} from './jobs.ducks';
import { put, call, take, fork, select } from 'redux-saga/effects';
import { mergeSaveBulkJobSaga, mergeRemoveBulkJobSaga } from '~/modules/common/state/companyInformation.sagas';
import { postRunJob, postRunBulkJob, postKillJob, postPromoteModel, postDeleteModel, postModelMetricsFetch, postModelChartsMetadataFetch, postModelChartFetch } from '~/modules/jobs/promises';
import { postCompanyUpdate } from '~/modules/common/promises';
import { actions as messageBarActions } from '~/modules/common/state/messageBar.ducks';
import { resolveStateTargetFromJobType, deleteInactiveScopeField } from '~/lib/state.helpers';
import config from '~/config/content';
import { jobsAppState } from '~/modules/common/state/selectors.sagas';
import { isEmpty } from 'lodash';
/**
 * run a job
 * @param  {string} companyName
 * @param  {string} model       model name
 * @param  {string} type        job type i.e. 'sample', 'select', 'all'
 * @param  {object} payload     job payload i.e. 'pids', or 'size'
 * @param  {object} config required to run 'models' jobs
 *                              this is the config object from the desired model from
 *                              GET /lumiata-morpheus/management/client-config-crud/get-morpheus-model-list/{clientId}
 */
export function* runJobSaga(companyName, jobType, model, scope, payload) {
	try {
		yield put(actions.runJobRequest(model, scope));

		const data = yield call(postRunJob, companyName, jobType, model, scope, payload);

		yield put(actions.runJobSuccess(model, scope, data));

		yield put(messageBarActions.success(
			config.global.snackbar.success.runSingleJob(model, scope)
		));
		return data;
	} catch (err) {
		yield put(actions.runJobError(err, model, scope));
		yield put(messageBarActions.error(
			config.global.snackbar.error.runSingleJob(model, scope)
		));
	}
}

export function* runBulkJobSaga(companyName, jobsList) {
	try {
		yield put(actions.runBulkJobRequest());

		const data = yield call(postRunBulkJob, companyName, jobsList);

		yield put(actions.runBulkJobSuccess());
		yield put(messageBarActions.success(config.global.snackbar.success.runBulkJob));

		return data;
	} catch (err) {
		yield put(actions.runBulkJobError(err));
		yield put(messageBarActions.error(config.global.snackbar.error.runBulkJob));
	}
}

export function* saveBulkJobSaga(company) {
	try {
		yield put(actions.saveBulkJobRequest());

		const data = yield call(postCompanyUpdate, company);

		yield put(actions.saveBulkJobSuccess());
		yield put(messageBarActions.success(config.global.snackbar.success.saveBulkJob));

		return data;
	} catch (err) {
		yield put(actions.saveBulkJobError(err));
		yield put(messageBarActions.error(config.global.snackbar.error.saveBulkJob));
	}
}

export function* removeBulkJobSaga(company) {
	try {
		yield put(actions.removeBulkJobRequest());

		const data = yield call(postCompanyUpdate, company);

		yield put(actions.removeBulkJobSuccess());
		yield put(messageBarActions.success(config.global.snackbar.success.removeBulkJob));

		return data;
	} catch (err) {
		yield put(actions.removeBulkJobError(err));
		yield put(messageBarActions.error(config.global.snackbar.error.removeBulkJob));
	}
}

export function* killJobSaga(transactionId) {
	try {
		yield put(actions.killJobRequest());

		const data = yield call(postKillJob, transactionId);

		yield put(actions.killJobSuccess());

		yield put(messageBarActions.success(config.global.snackbar.success.killJob));

		return data;
	} catch (err) {
		yield put(actions.killJobError(err));
		yield put(messageBarActions.error(config.global.snackbar.error.killJob));
	}
}

export function* modelPromoteSaga(companyName, model) {
	try {
		yield put(actions.modelPromoteRequest());

		const data = yield call(postPromoteModel, companyName, model);

		yield put(actions.modelPromoteSuccess(model));

		yield put(
			messageBarActions.success(config.global.snackbar.success.promoteModel(model.label, model.stage))
		);

		return data;
	} catch (err) {
		yield put(actions.modelPromoteError(err));
		yield put(
			messageBarActions.error(config.global.snackbar.error.promoteModel(model.label))
		);
	}
}

export function* modelDeleteSaga(companyName, model) {
	try {
		yield put(actions.modelDeleteRequest());

		const data = yield call(postDeleteModel, companyName, model.id);

		yield put(actions.modelDeleteSuccess(model.id));

		yield put(messageBarActions.success(config.global.snackbar.success.deleteModel(model.label)));

		return data;
	} catch (err) {
		yield put(actions.modelDeleteError(err));
		yield put(messageBarActions.error(config.global.snackbar.error.deleteModel(model.label)));
	}
}

export function* modelMetricsFetchSaga(companyName, model) {
	try {
		yield put(actions.modelMetricsFetchRequest(model.id));

		const data = yield call(postModelMetricsFetch, companyName, model.id);

		yield put(actions.modelMetricsFetchSuccess(model.id, data));

		return data;
	} catch (err) {
		yield put(actions.modelMetricsFetchError(err));
	}
}

export function* modelChartsMetadataFetchSaga(companyName, model) {
	try {
		yield put(actions.modelChartsMetadataFetchRequest());

		const chartList = yield call(postModelChartsMetadataFetch, companyName, model.id);

		yield put(actions.modelChartsMetadataFetchSuccess(model.id, chartList));

		return chartList;
	} catch (err) {
		yield put(actions.modelChartsMetadataFetchError(err));
	}
}

export function* modelChartFetchSaga(companyName, model, chartName) {
	try {
		yield put(actions.modelChartFetchRequest());

		const data = yield call(postModelChartFetch, companyName, model.id, chartName);

		yield put(actions.modelChartFetchSuccess(model.id, data));

		return data;
	} catch (err) {
		yield put(actions.modelChartFetchError(err));
	}
}

export function* watchRunJob() {
	while(true) {
		const { companyName, model, jobType, payload: { scope, ...others } } = yield take(RUN_JOB_SAGA);

		const payload = yield call(deleteInactiveScopeField, scope, others);

		yield fork(runJobSaga, companyName, jobType, model, scope, payload);
	}
}

export function* watchRunBulkJob() {
	while(true) {
		const { companyName, jobsList } = yield take(RUN_BULK_JOB_SAGA);

		yield fork(runBulkJobSaga, companyName, jobsList);
	}
}

export function* watchSaveBulkJob() {
	while(true) {
		const { jobName, jobsList } = yield take(SAVE_BULK_JOB_SAGA);

		const { company } = yield call(mergeSaveBulkJobSaga, jobName, jobsList);

		yield fork(saveBulkJobSaga, company);
	}
}

export function* watchJobConfigurationUpdateSaga() {
	while(true) {
		const { type, ...payload } = yield take(JOB_CONFIGURATION_UPDATE_SAGA);

		const updatedValue = payload.dataArgs[ payload.targetArg ];
		yield put( actions.jobConfigurationUpdate({ ...payload, updatedValue }) );
	}
}

export function* watchRemoveBulkJob() {
	while(true) {
		const { jobName } = yield take(REMOVE_SAVED_JOB_SAGA);

		const { company } = yield call(mergeRemoveBulkJobSaga, jobName);

		yield fork(removeBulkJobSaga, company);
	}
}

export function* watchKillJobSaga() {
	while(true) {
		const { transactionIdList } = yield take(KILL_JOB_SAGA);

		for (let id of transactionIdList) {
			yield fork(killJobSaga, id.transactionId);
		}
	}
}

export function* watchModelPromoteSaga() {
	while(true) {
		const { companyName, model } = yield take(MODEL_PROMOTE_SAGA);

		yield fork(modelPromoteSaga, companyName, model);
	}
}

export function* watchModelDeleteSaga() {
	while(true) {
		const { companyName, model } = yield take(MODEL_DELETE_SAGA);

		yield fork(modelDeleteSaga, companyName, model);
	}
}

export function* watchModelMetricsFetchSaga() {
	while(true) {
		const { companyName, model } = yield take(MODEL_METRICS_FETCH_SAGA);

		const jobsState = yield select(jobsAppState);

		// short circuit the fetch if model is populated
		if (!isEmpty(jobsState.jobs[model.id].charts) && !isEmpty(jobsState.jobs[model.id].metrics)) return;

		yield fork(modelMetricsFetchSaga, companyName, model);

		const metadataList = yield call(modelChartsMetadataFetchSaga, companyName, model);

		const chartList = (metadataList || []).filter(({ type }) => type !== 'DIRECTORY');

		for (let { pathSuffix } of chartList) {
			yield fork(modelChartFetchSaga, companyName, model, pathSuffix);
		}
	}
}

export default [
	watchRunJob(),
	watchRunBulkJob(),
	watchSaveBulkJob(),
	watchJobConfigurationUpdateSaga(),
	watchRemoveBulkJob(),
  watchKillJobSaga(),
	watchModelPromoteSaga(),
	watchModelDeleteSaga(),
	watchModelMetricsFetchSaga()
];
