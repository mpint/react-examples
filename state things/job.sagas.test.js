import * as m from '../jobs.sagas';

import { nextValue, throwValue } from '~/lib/test.helpers';
import { actions } from '../jobs.ducks';
import { put, take, call, fork, select } from 'redux-saga/effects';
import { mergeSaveBulkJobSaga, mergeRemoveBulkJobSaga } from '~/modules/common/state/companyInformation.sagas';
import { actions as messageBarActions } from '~/modules/common/state/messageBar.ducks';
import { jobsAppState } from '~/modules/common/state/selectors.sagas';
import config from '~/config/content';
import { deleteInactiveScopeField } from '~/lib/state.helpers';

const others = { otherThing: 'other things' };
const company = { company: 'profile' };
const companyName = 'a valid company name';
const scope = 'all';
const jobType = 'a valid type';
const model = {};
const payload = {
  scope,
  ...others
};
const jobsList = ['a', 'b', 'c'];
const jobName = 'a job name';
const trainingModelId = 'staging~123';
const jobsState = {
  jobs: {
    [ trainingModelId ]: { charts: { some_chart: 'asd_123.jpg' }, metrics: { k: 5 } }
  }
};

describe('jobs.sagas', () => {

  describe('watchRunJob', () => {
    it(`runs a job`, () => {
      const saga = m.watchRunJob();
      expect(
        nextValue(saga)
      ).toEqual(
        take(actions.runJobSaga().type)
      );

      const payload = { companyName, model, jobType, payload };

      expect(
        nextValue(saga, payload )
      ).toEqual(
        call(deleteInactiveScopeField, scope, others)
      );

      expect(
        nextValue(saga, payload )
      ).toEqual(
        fork(m.runJobSaga, companyName, jobType, model, scope, others)
      );
    });
  });

  describe('watchRunBulkJob', () => {
    it(`runs a bulk job`, () => {
      const saga = m.watchRunBulkJob();
      expect(
        nextValue(saga)
      ).toEqual(
        take(actions.runBulkJobSaga().type)
      );

      expect(
        nextValue(saga,
          { companyName, jobsList }
        )
      ).toEqual(
        fork(m.runBulkJobSaga, companyName, jobsList)
      );
    });
  });

  describe('watchSaveBulkJob', () => {
    it(`saves a bulk job to company profile`, () => {
      const saga = m.watchSaveBulkJob();
      expect(
        nextValue(saga)
      ).toEqual(
        take(actions.saveBulkJobSaga().type)
      );

      expect(
        nextValue(saga, { jobName, jobsList })
      ).toEqual(
        call(mergeSaveBulkJobSaga, jobName, jobsList)
      );

      expect(
        nextValue(saga, { company })
      ).toEqual(
        fork(m.saveBulkJobSaga, company)
      );
    });
  });

  describe('watchJobConfigurationUpdateSaga', () => {
    it(`updates a job configuration`, () => {
      const saga = m.watchJobConfigurationUpdateSaga();

      expect(
        nextValue(saga)
      ).toEqual(
        take(actions.jobConfigurationUpdateSaga().type)
      );

      expect(
        nextValue(saga, payload)
      ).toEqual(
        put(actions.jobConfigurationUpdate(payload))
      );
    });
  });

  describe('watchKillJobSaga', () => {
    it(`kills a list of jobs`, () => {
      const saga = m.watchKillJobSaga();

      expect(
        nextValue(saga)
      ).toEqual(
        take(actions.killJobSaga().type)
      );

      const transactionIdList = [
        { transactionId: '123'},
        { transactionId: '512'}
      ];

      for (let id of transactionIdList) {
        expect(
          nextValue(saga, { transactionIdList })
        ).toEqual(
          fork(m.killJobSaga, id.transactionId)
        );
      }
    });
  });

  describe('watchModelPromoteSaga', () => {
    it(`promotes a model in the training pipeline`, () => {
      const saga = m.watchModelPromoteSaga();

      expect(
        nextValue(saga)
      ).toEqual(
        take(actions.modelPromoteSaga().type)
      );

      expect(
        nextValue(saga, { companyName, model })
      ).toEqual(
        fork(m.modelPromoteSaga, companyName, model)
      );
    });
  });

  describe('watchModelDeleteSaga', () => {
    it(`deletes a model in the training pipeline`, () => {
      const saga = m.watchModelDeleteSaga();

      expect(
        nextValue(saga)
      ).toEqual(
        take(actions.modelDeleteSaga().type)
      );

      expect(
        nextValue(saga, { companyName, model })
      ).toEqual(
        fork(m.modelDeleteSaga, companyName, model)
      );
    });
  });

  describe('watchModelMetricsFetchSaga', () => {
    it(`fetches metrics on a model in the training pipeline`, () => {
      const saga = m.watchModelMetricsFetchSaga();

      expect(
        nextValue(saga)
      ).toEqual(
        take(actions.modelMetricsFetchSaga().type)
      );

      expect(
        nextValue(saga, { companyName, model: { id: trainingModelId } })
      ).toEqual(
        select(jobsAppState)
      );

      expect(
        nextValue(saga, jobsState)
      ).toEqual(
        fork(m.modelMetricsFetchSaga, companyName, model)
      );

      expect(
        nextValue(saga)
      ).toEqual(
        call(m.modelChartsMetadataFetchSaga, companyName, model)
      );

      const chartList = [
        { pathSuffix: 'chart1', type: 'FILE' },
        { pathSuffix: 'chart2', type: 'FILE' }
      ];

      for (let chart of chartList) {
        expect(
          nextValue(saga, chartList)
        ).toEqual(
          fork(m.modelChartFetchSaga, companyName, model, chart.pathSuffix)
        );
      }
    });
  });

  describe('watchRemoveBulkJob', () => {
    it(`deletes a saved job from a company profile`, () => {
      const saga = m.watchRemoveBulkJob();
      expect(
        nextValue(saga)
      ).toEqual(
        take(actions.removeSavedJobSaga().type)
      );

      expect(
        nextValue(saga, { jobName })
      ).toEqual(
        call(mergeRemoveBulkJobSaga, jobName)
      );

      expect(
        nextValue(saga, { company })
      ).toEqual(
        fork(m.removeBulkJobSaga, company)
      );
    });
  });
});
