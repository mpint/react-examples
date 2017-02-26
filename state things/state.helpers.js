import { chain, find, snakeCase, camelCase, startCase, isEmpty, isArray, isObject, map, mapKeys, reduce, forEach, filter, flatten, last, get } from 'lodash';
import deepExtend from 'deep-extend';

/*
  decorates incoming jobsConfig with jobMetadata maintained in jobMetadata.constants.js
 */

export function jobStateDecorator(type, jobsModel) {
  return reduce(jobsModel, (out, job, key) => {
    const jobConfig = job.config;
    const jobMetadata = jobMetadataMapper(key);
    const jobTransformer = jobTransformerMapper(key);

    const extended = deepExtend({}, jobConfig, jobMetadata);

    const extendedModel = {
      ...out,
      [ key ]: {
        ...job,
        config: jobTransformer(
          extended
        )
      }
    };

    // ditch the reference
    extendedModel[key]._config = { ...extendedModel[key].config };
    return extendedModel;
  }, {});
}

/**
 * reduces lists of runner data into job model element objects
 *
 * @param  {array} retrievedJobsList list of runners to add to the state manager
 * @return {object}              job state manager
 */
export function jobInjectionReducer(type, retrievedJobsList = [], dxMap) {
  function reduceModelArrayList(type, retrievedModelList = [], dxMap) {
    function generateModelId({ stage, dxCode, predictionDays, version, modelId }) {
      return `${stage}~${dxCode}~${predictionDays}~${version}~${modelId}`;
    }

    return retrievedModelList.reduce((out, model) => {
      const { stage, modelId, lastModified, args } = model;
      const camelCaseConfig = mapKeys(args, (val, k) => camelCase(k));
      const { modelName, predictionDays, version, category, diagnosis, subDiagnosis } = camelCaseConfig;

      const dxCode = [ category, diagnosis, subDiagnosis ]
        .map((data) => data.value)
        .join('.');

      return {
        ...out,
        [ modelId ]: {
          id: modelId,
          lastModified,
          type,
          stage,
          label: dxMap[ dxCode ] ? dxMap[ dxCode ].split('.').map(startCase).join(' > ') : modelName,
          config: camelCaseConfig,
          _config: camelCaseConfig,
          _request: statusProps
        }
      };
    }, {});
  }

  function reduceJobArrayList(type, jobList) {
    return jobList.reduce((out, config) => {
      const id = resolveJobId(retrievedJobsList, config);
      return {
        ...out,
        [id]: {
          id,
          type,
          config,
          label: startCase(id),
          _config: { ...config },
          _request: statusProps
        }
      };
    }, {});
  }

  function reduceJobObjectList(type, jobs) {
    return reduce(jobs, (out, { args }, key) => {
      const id = resolveJobId(retrievedJobsList, undefined, key);
      return {
        ...out,
        [id]: {
          id,
          type,
          config: args,
          label: startCase(id),
          _config: { ...args },
          _request: statusProps
        }
      };
    }, {});
  }

  switch (type) {
    case 'models':
      return reduceModelArrayList(type, retrievedJobsList, dxMap);
    case 'morpheusModels':
    case 'transformations':
    case 'modelPipeline':
    case 'cohorts':
    case 'exports':
    case 'statistics':
    case 'dataReconciliation':
      return reduceJobObjectList(type, retrievedJobsList);
    default:
      throw new Error('bad type');
  }
}
