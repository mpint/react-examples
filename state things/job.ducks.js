/**
 * company information data that is loaded when user logs in
 */
import { jobsModel as initial, statusPropsRequesting, statusPropsSuccess, statusPropsFailed } from '~/config/state/store/initialState';
import { modelInjectionReducer, jobStatusReducer, jobInjectionReducer, jobStateDecorator, jobConfigurationUpdater, rectifiers, appendValuePropToArray, modelStageResolver, modelIdResolver } from '~/lib/state.helpers';

/*
  actions
 */
export const RUN_JOB_SAGA = 'SERAPH/JOBS/RUN_JOB_SAGA';
export const RUN_BULK_JOB_SAGA = 'SERAPH/JOBS/RUN_BULK_JOB_SAGA';
export const SAVE_BULK_JOB_SAGA = 'SERAPH/JOBS/SAVE_BULK_JOB_SAGA';
export const KILL_JOB_SAGA = 'SERAPH/JOBS/KILL_JOB_SAGA';
export const REMOVE_SAVED_JOB_SAGA = 'SERAPH/JOBS/REMOVE_SAVED_JOB_SAGA';
export const JOB_CONFIGURATION_UPDATE_SAGA = 'SERAPH/JOBS/JOB_CONFIGURATION_UPDATE_SAGA';
export const MODEL_METRICS_FETCH_SAGA = 'SERAPH/JOBS/MODEL_METRICS_FETCH_SAGA';
export const MODEL_CHARTS_FETCH_SAGA = 'SERAPH/JOBS/MODEL_CHARTS_FETCH_SAGA';

export const RUN_JOB_REQUEST = 'SERAPH/JOBS/RUN_JOB_REQUEST';
export const RUN_JOB_SUCCESS = 'SERAPH/JOBS/RUN_JOB_SUCCESS';
export const RUN_JOB_ERROR = 'SERAPH/JOBS/RUN_JOB_ERROR';

export const SAVE_BULK_JOB_REQUEST = 'SERAPH/JOBS/SAVE_BULK_JOB_REQUEST';
export const SAVE_BULK_JOB_SUCCESS = 'SERAPH/JOBS/SAVE_BULK_JOB_SUCCESS';
export const SAVE_BULK_JOB_ERROR = 'SERAPH/JOBS/SAVE_BULK_JOB_ERROR';

export const REMOVE_BULK_JOB_REQUEST = 'SERAPH/JOBS/REMOVE_BULK_JOB_REQUEST';
export const REMOVE_BULK_JOB_SUCCESS = 'SERAPH/JOBS/REMOVE_BULK_JOB_SUCCESS';
export const REMOVE_BULK_JOB_ERROR = 'SERAPH/JOBS/REMOVE_BULK_JOB_ERROR';

export const RUN_BULK_JOB_REQUEST = 'SERAPH/JOBS/RUN_BULK_JOB_REQUEST';
export const RUN_BULK_JOB_SUCCESS = 'SERAPH/JOBS/RUN_BULK_JOB_SUCCESS';
export const RUN_BULK_JOB_ERROR = 'SERAPH/JOBS/RUN_BULK_JOB_ERROR';

export const KILL_JOB_REQUEST = 'SERAPH/JOBS/KILL_JOB_REQUEST';
export const KILL_JOB_SUCCESS = 'SERAPH/JOBS/KILL_JOB_SUCCESS';
export const KILL_JOB_ERROR = 'SERAPH/JOBS/KILL_JOB_ERROR';

export const JOB_RESULT_SUCCESS = 'SERAPH/JOBS/JOB_RESULT_SUCCESS';
export const JOB_RESULT_ERROR = 'SERAPH/JOBS/JOB_RESULT_ERROR';

export const JOB_CONFIGURATION_UPDATE = 'SERAPH/JOBS/CONFIGURATION_UPDATE';

export const INJECT_JOBS = 'SERAPH/JOBS/INJECT_JOBS';

export const SELECT_JOB_ALL = 'SERAPH/JOBS/SELECT_JOB_ALL';
export const SELECT_JOB_NONE = 'SERAPH/JOBS/SELECT_JOB_NONE';
export const SELECT_JOB_DEFAULT = 'SERAPH/JOBS/SELECT_JOB_DEFAULT';

export const RESET_JOB = 'SERAPH/JOBS/RESET_JOB';

export const MODEL_PROMOTE_SAGA = 'SERAPH/JOBS/MODEL_PROMOTE_SAGA';
export const MODEL_DELETE_SAGA = 'SERAPH/JOBS/MODEL_DELETE_SAGA';

export const MODEL_PROMOTE_REQUEST = 'SERAPH/JOBS/MODEL_PROMOTE_REQUEST';
export const MODEL_PROMOTE_SUCCESS = 'SERAPH/JOBS/MODEL_PROMOTE_SUCCESS';
export const MODEL_PROMOTE_ERROR = 'SERAPH/JOBS/MODEL_PROMOTE_ERROR';

export const MODEL_DELETE_REQUEST = 'SERAPH/JOBS/MODEL_DELETE_REQUEST';
export const MODEL_DELETE_SUCCESS = 'SERAPH/JOBS/MODEL_DELETE_SUCCESS';
export const MODEL_DELETE_ERROR = 'SERAPH/JOBS/MODEL_DELETE_ERROR';

export const MODEL_METRICS_FETCH_REQUEST = 'SERAPH/JOBS/MODEL_METRICS_FETCH_REQUEST';
export const MODEL_METRICS_FETCH_SUCCESS = 'SERAPH/JOBS/MODEL_METRICS_FETCH_SUCCESS';
export const MODEL_METRICS_FETCH_ERROR = 'SERAPH/JOBS/MODEL_METRICS_FETCH_ERROR';

export const MODEL_CHARTS_METADATA_FETCH_REQUEST = 'SERAPH/JOBS/MODEL_CHARTS_METADATA_FETCH_REQUEST';
export const MODEL_CHARTS_METADATA_FETCH_SUCCESS = 'SERAPH/JOBS/MODEL_CHARTS_METADATA_FETCH_SUCCESS';
export const MODEL_CHARTS_METADATA_FETCH_ERROR = 'SERAPH/JOBS/MODEL_CHARTS_METADATA_FETCH_ERROR';

export const MODEL_CHART_FETCH_REQUEST = 'SERAPH/JOBS/MODEL_CHART_FETCH_REQUEST';
export const MODEL_CHART_FETCH_SUCCESS = 'SERAPH/JOBS/MODEL_CHART_FETCH_SUCCESS';
export const MODEL_CHART_FETCH_ERROR = 'SERAPH/JOBS/MODEL_CHART_FETCH_ERROR';


export const INJECT_MODELS = 'SERAPH/JOBS/INJECT_MODELS';
export const RESET_STATE = 'SERAPH/JOBS/RESET_STATE';
/*
  action creators
 */
export const actions = {
  resetState: () => {
    return { type: RESET_STATE };
  },

  runJobSaga: (companyName, model, jobType, payload) => {
    return { type: RUN_JOB_SAGA, companyName, model, jobType, payload };
  },

  runBulkJobSaga: (companyName, jobsList) => {
    return { type: RUN_BULK_JOB_SAGA, companyName, jobsList };
  },

  saveBulkJobSaga: (jobName, jobsList) => {
    return { type: SAVE_BULK_JOB_SAGA, jobName, jobsList };
  },

  killJobSaga: (transactionIdList) => {
    return { type: KILL_JOB_SAGA, transactionIdList };
  },

  jobConfigurationUpdate: (updated) => {
    return { type: JOB_CONFIGURATION_UPDATE, ...updated };
  },

  injectJobs: (jobType, jobList) => {
    return { type: INJECT_JOBS, jobType, jobList };
  },

  resetJob: (jobName) => {
    return { type: RESET_JOB, jobName };
  },

  injectModels: (jobType, jobList, dxMap) => {
    return { type: INJECT_MODELS, jobType, jobList, dxMap };
  },

  modelPromoteSaga: (companyName, model) => {
    return { type: MODEL_PROMOTE_SAGA, companyName, model };
  },

  modelDeleteSaga: (companyName, model) => {
    return { type: MODEL_DELETE_SAGA, companyName, model };
  },

  modelPromoteRequest: () => {
    return { type: MODEL_PROMOTE_REQUEST };
  },

  modelPromoteSuccess: ({ id, stage, config }) => {
    return { type: MODEL_PROMOTE_SUCCESS, modelId: id, stage, config };
  },

  modelPromoteError: ({ status }) => {
    return { type: MODEL_PROMOTE_ERROR, status };
  },

  modelDeleteRequest: (modelId) => {
    return { type: MODEL_DELETE_REQUEST, modelId };
  },

  modelDeleteSuccess: (modelId) => {
    return { type: MODEL_DELETE_SUCCESS, modelId };
  },

  modelDeleteError: ({ status }) => {
    return { type: MODEL_DELETE_ERROR, status };
  },

  modelMetricsFetchSaga: (companyName, model) => {
    return { type: MODEL_METRICS_FETCH_SAGA, companyName, model };
  },

  modelMetricsFetchRequest: (modelId) => {
    return { type: MODEL_METRICS_FETCH_REQUEST, modelId };
  },

  modelMetricsFetchSuccess: (modelId, metrics) => {
    return { type: MODEL_METRICS_FETCH_SUCCESS, modelId, metrics };
  },

  modelMetricsFetchError: ({ status }) => {
    return { type: MODEL_METRICS_FETCH_ERROR, status };
  },

  modelChartsMetadataFetchRequest: () => {
    return { type: MODEL_CHARTS_METADATA_FETCH_REQUEST };
  },

  modelChartsMetadataFetchSuccess: (modelId, response) => {
    return { type: MODEL_CHARTS_METADATA_FETCH_SUCCESS, modelId, response };
  },

  modelChartsMetadataFetchError: ({ status }) => {
    return { type: MODEL_CHARTS_METADATA_FETCH_ERROR, status };
  },

  modelChartFetchRequest: () => {
    return { type: MODEL_CHART_FETCH_REQUEST };
  },

  modelChartFetchSuccess: (modelId, { imageName, imageUrl }) => {
    return { type: MODEL_CHART_FETCH_SUCCESS, imageName, imageUrl, modelId };
  },

  modelChartFetchError: ({ status }) => {
    return { type: MODEL_CHART_FETCH_ERROR, status };
  }
};


export default function jobsAppState(state = initial, action) {
	switch (action.type) {
		case JOB_CONFIGURATION_UPDATE:
      const updatedJobState = {
        ...state,
        jobs: {
          ...jobConfigurationUpdater(state.jobs, action)
        }
      };

      const configRectifier = rectifiers.config;
      const jobRectifier = rectifiers.jobs[action.jobName];
      const updatedConfig = updatedJobState.jobs[ action.jobName ].config;

      const out = {
        ...updatedJobState,
        jobs: {
          ...updatedJobState.jobs,
          [ action.jobName ]: {
            ...updatedJobState.jobs[ action.jobName ],
            config: jobRectifier ?
              configRectifier( action, jobRectifier(action, updatedConfig) ) :
              configRectifier( action, updatedConfig )
          }
        }
      };

      return out;

    case INJECT_JOBS:
			return {
				...state,
        status: {
          ...state.status,
          [ action.jobType ]: 'injected',
          ...(jobStatusReducer(action.jobList))
        },
        jobs: {
          ...state.jobs,
          ...(jobStateDecorator(action.jobType, jobInjectionReducer(action.jobType, action.jobList)))
        }
			};

    case INJECT_MODELS:
      // delete existing models before injection to erase ones for different companies
      const modelKeys = Object.keys(state.jobs)
        .filter((modelName) => modelName.includes('~'));

      modelKeys.forEach((key) => delete state.jobs[key]);

			return {
				...state,
        status: {
          ...state.status,
          [ action.jobType ]: 'injected',
          ...(jobStatusReducer(action.jobList))
        },
        jobs: {
          ...state.jobs,
          ...(jobStateDecorator(action.jobType, jobInjectionReducer(action.jobType, action.jobList, action.dxMap)))
        }
			};

    case RESET_JOB:
      return {
        ...state,
        jobs: {
          ...state.jobs,
          [ action.jobName ]: {
            ...state.jobs[ action.jobName ],
            config: { ...state.jobs[ action.jobName ]._config }
          }
        }
      };

    case MODEL_PROMOTE_REQUEST:
      return {
        ...state
      };

    case MODEL_PROMOTE_SUCCESS:
      const modelTarget = modelIdResolver(action.modelId, state.jobs);
      const newStage = modelStageResolver(action.stage);
      const jobInfo = state.jobs[modelTarget];
      const id = [ newStage, ...modelTarget.split('~').slice(1) ].join('~');

      // maintain current job id, but update the configuration
      // information inside the job itself
      const updated = {
        ...state,
        jobs: {
          ...state.jobs,
          [ modelTarget ]: {
            ...jobInfo,
            id,
            label: id,
            stage: newStage
          }
        }
      };

      return updated;

    case MODEL_PROMOTE_ERROR:
    var modelTarget = modelIdResolver(action.modelId, state.jobs);

    return {
      ...state,
      jobs: {
        ...state.jobs,
        [ modelTarget ]: {
          ...state.jobs[ modelTarget ],
          _request: {
            ...statusPropsError
          }
        }
      }
    };

    case MODEL_DELETE_REQUEST:
      var modelTarget = modelIdResolver(action.modelId, state.jobs);

    return {
      ...state,
      jobs: {
        ...state.jobs,
        [ modelTarget ]: {
          ...state.jobs[ modelTarget ],
          _request: {
            ...statusPropsRequesting
          }
        }
      }
    };

    case MODEL_DELETE_SUCCESS:
      var modelTarget = modelIdResolver(action.modelId, state.jobs);

      delete state.jobs[ modelTarget ];

      return {
        ...state,
        jobs: {
          ...state.jobs
        }
      };

    case MODEL_DELETE_ERROR:
      var modelTarget = modelIdResolver(action.modelId, state.jobs);

      return {
        ...state,
        jobs: {
          ...state.jobs,
          [ modelTarget ]: {
            ...state.jobs[ modelTarget ],
            _request: {
              ...statusPropsError
            }
          }
        }
      };

    case MODEL_METRICS_FETCH_REQUEST:
      var modelTarget = modelIdResolver(action.modelId, state.jobs);

      return {
        ...state,
        jobs: {
          ...state.jobs,
          [ modelTarget ]: {
            ...state.jobs[ modelTarget ],
            _request: {
              ...statusPropsRequesting
            }
          }
        }
      };

    case MODEL_METRICS_FETCH_SUCCESS:
      var modelTarget = modelIdResolver(action.modelId, state.jobs);

      return {
        ...state,
        jobs: {
          ...state.jobs,
          [ modelTarget ]: {
            ...state.jobs[ modelTarget ],
            _request: {
              ...statusPropsSuccess
            },
            metrics: action.metrics
          }
        }
      };

    case MODEL_METRICS_FETCH_ERROR:
      var modelTarget = modelIdResolver(action.modelId, state.jobs);

      return {
        ...state,
        jobs: {
          ...state.jobs,
          [ modelTarget ]: {
            ...state.jobs[ modelTarget ],
            _request: {
              ...statusPropsFailed,
              status: action.status
            }
          }
        }
      };

    case MODEL_CHARTS_METADATA_FETCH_REQUEST:
      var modelTarget = modelIdResolver(action.modelId, state.jobs);

      return {
        ...state,
        jobs: {
          ...state.jobs,
          [ modelTarget ]: {
            ...state.jobs[ modelTarget ],
            _request: {
              ...statusPropsRequesting
            }
          }
        }
      };

    case MODEL_CHARTS_METADATA_FETCH_SUCCESS:
      var modelTarget = modelIdResolver(action.modelId, state.jobs);

      return {
        ...state,
        jobs: {
          ...state.jobs,
          [ modelTarget ]: {
            ...state.jobs[ modelTarget ],
            _request: {
              ...statusPropsSuccess
            }
          }
        }
      };

    case MODEL_CHARTS_METADATA_FETCH_ERROR:
      var modelTarget = modelIdResolver(action.modelId, state.jobs);

      return {
        ...state,
        jobs: {
          ...state.jobs,
          [ modelTarget ]: {
            ...state.jobs[ modelTarget ],
            _request: {
              ...statusPropsFailed,
              status: action.status
            }
          }
        }
      };

    case MODEL_CHART_FETCH_REQUEST:
      var modelTarget = modelIdResolver(action.modelId, state.jobs);

      return {
        ...state,
        jobs: {
          ...state.jobs,
          [ modelTarget ]: {
            ...state.jobs[ modelTarget ],
            _request: {
              ...statusPropsRequesting
            }
          }
        }
      };

    case MODEL_CHART_FETCH_SUCCESS:
      var modelTarget = modelIdResolver(action.modelId, state.jobs);

      return {
        ...state,
        jobs: {
          ...state.jobs,
          [ modelTarget ]: {
            ...state.jobs[ modelTarget ],
            _request: {
              ...statusPropsSuccess
            },
            charts: {
              ...state.jobs[ modelTarget ].charts,
              [ action.imageName ]: {
                imageName: action.imageName,
                imageUrl: action.imageUrl
              }
            }
          }
        }
      };

    case MODEL_CHART_FETCH_ERROR:
      var modelTarget = modelIdResolver(action.modelId, state.jobs);

      return {
        ...state,
        jobs: {
          ...state.jobs,
          [ modelTarget ]: {
            ...state.jobs[ modelTarget ],
            _request: {
              ...statusPropsFailed,
              status: action.status
            }
          }
        }
      };

		default:
			return state;
	}
}
