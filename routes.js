import React from 'react';
import { Route, IndexRoute } from 'react-router';
import config from '~/config/content';
import AppRoot from '~/modules/common/containers/AppRoot';
import Main from '~/modules/common/containers/Main';
import CompanyRoot from '~/modules/common/containers/CompanyRoot';
import NotFoundPage from '~/modules/common/components/NotFoundPage';
import LoginPage from '~/modules/auth/containers/LoginPage';
import ProfilePage from '~/modules/profile/containers/ProfilePage';
import AddProfilePage from '~/modules/profile/containers/AddProfilePage';
import MappingPage from '~/modules/mapping/containers/MappingPage';
import RawDataPage from '~/modules/mapping/containers/RawDataPage';
import EditorPage from '~/modules/code-editor/containers/EditorPage';
import StatusPage from '~/modules/status/containers/StatusPage';
import CompanyDashboardPage from '~/modules/common/containers/CompanyDashboardPage';
import TransformPage from '~/modules/jobs/containers/TransformPage';
import TrainPage from '~/modules/jobs/containers/TrainPage';
import ApplyPage from '~/modules/jobs/containers/ApplyPage';
import ExportPage from '~/modules/jobs/containers/ExportPage';
import OutputPage from '~/modules/common/containers/OutputPage';
import LogAnalyticsPage from '~/modules/common/containers/LogAnalyticsPage';
import ReviewPage from '~/modules/common/containers/ReviewPage';
import CompanySelectionRequiredPage from '~/modules/common/components/CompanySelectionRequiredPage';
import MorpheusDocumentationPage from '~/modules/common/containers/MorpheusDocumentationPage';
import RedQueenPage from '~/modules/common/containers/RedQueenPage';
import DataReconciliationPage from '~/modules/common/containers/DataReconciliationPage';
import BulkJobRunnerPage from '~/modules/common/containers/BulkJobRunnerPage';
import ValidatorPage from '~/modules/common/containers/ValidatorPage';
import ModelDataValidationPage from '~/modules/common/containers/ModelDataValidationPage';
import DecisionTreePage from '~/modules/common/containers/DecisionTreePage';
import ControlFilesPage from '~/modules/common/containers/ControlFilesPage';
import TableStatisticsPage from '~/modules/common/containers/TableStatisticsPage';

import injectConfiguration from '~/modules/common/containers/injectConfig';
import requiresAuth from '~/modules/auth/containers/requiresAuth';
import requiresAccess from '~/modules/auth/containers/requiresAccess';
import requiresCompanySelection from '~/modules/auth/containers/requiresCompanySelection';

import { composeComponents } from '~/lib/utility.helpers';

const AuthorizedTransformPage = composeComponents(
  TransformPage,
  [
    (c) => requiresAccess(c,
      config.pages.transform.access.roles,
      { redirectTo: config.pages.transform.access.redirectTo }
    )
  ]
);

const AuthorizedTrainPage = composeComponents(
  TrainPage,
  [
    (c) => requiresAccess(c,
      config.pages.train.access.roles,
      { redirectTo: config.pages.train.access.redirectTo }
    )
  ]
);

const AuthorizedAddProfilePage = composeComponents(
  AddProfilePage,
  [
    (c) => requiresAccess(c,
      config.pages.addProfile.access.roles,
      { redirectTo: config.pages.addProfile.access.redirectTo }
    )
  ]
);

const AuthorizedProfilePage = composeComponents(
  ProfilePage,
  [
    (c) => requiresAccess(c,
      config.pages.profile.access.roles,
      { redirectTo: config.pages.profile.access.redirectTo }
    )
  ]
);

const AuthorizedApplyPage = composeComponents(
  ApplyPage,
  [
    (c) => requiresAccess(c,
      config.pages.apply.access.roles,
      { redirectTo: config.pages.apply.access.redirectTo }
    )
  ]
);

const AuthorizedExportPage = composeComponents(
  ExportPage,
  [
    (c) => requiresAccess(c,
      config.pages.export.access.roles,
      { redirectTo: config.pages.export.access.redirectTo }
    )
  ]
);

const AuthorizedStatusPage = composeComponents(
  StatusPage,
  [
    (c) => requiresAccess(c,
      config.pages.status.access.roles,
      { redirectTo: config.pages.status.access.redirectTo }
    )
  ]
);

const AuthorizedMappingPage = composeComponents(
  MappingPage,
  [
    (c) => requiresAccess(c,
      config.pages.mapping.access.roles,
      { redirectTo: config.pages.mapping.access.redirectTo }
    )
  ]
);

const AuthorizedLogAnalyticsPage = composeComponents(
  LogAnalyticsPage,
  [
    (c) => requiresAccess(c,
      config.pages.embedded.logAnalytics.access.roles,
      { redirectTo: config.pages.embedded.logAnalytics.access.redirectTo }
    )
  ]
);

const AuthorizedReviewPage = composeComponents(
  ReviewPage,
  [
    (c) => requiresAccess(c,
      config.pages.review.access.roles,
      { redirectTo: config.pages.review.access.redirectTo }
    )
  ]
);

const AuthorizedOutputPage = composeComponents(
  OutputPage,
  [
    (c) => requiresAccess(c,
      config.pages.embedded.output.access.roles,
      { redirectTo: config.pages.embedded.output.access.redirectTo }
    )
  ]
);

export default (
  <Route component={ injectConfiguration(AppRoot) } path="/">
    <IndexRoute component={ LoginPage }/>

    <Route component={ requiresAuth(Main) } path={ config.pages.companySelectionRequired.slug }>
      <IndexRoute component={ CompanySelectionRequiredPage }/>

      <Route component={ AuthorizedAddProfilePage } path={ config.pages.addProfile.slug }/>
      <Route component={ MorpheusDocumentationPage } path={ config.pages.embedded.morpheusDocumentation.slug } />

      <Route component={ CompanyRoot } path=":companyName">
        <IndexRoute component={ CompanyDashboardPage }/>

        <Route component={ CompanyDashboardPage } path={ config.pages.companyDashboard.slug }/>

        <Route component={ requiresCompanySelection(AuthorizedProfilePage) } path={ config.pages.profile.slug }/>

        <Route component={ AuthorizedTransformPage } path={ config.pages.transform.slug }>
          <Route component={ TransformPage } path={ config.pages.singleJob.slug } />
          <Route component={ TransformPage } path={ config.pages.bulkJob.slug } />
        </Route>

        <Route component={ AuthorizedTrainPage } path={ config.pages.train.slug }>
          <Route component={ TrainPage } path={ config.pages.singleJob.slug } />
          <Route component={ TrainPage } path={ config.pages.bulkJob.slug } />
        </Route>

        <Route component={ AuthorizedApplyPage } path={ config.pages.apply.slug }>
          <Route component={ ApplyPage } path={ config.pages.singleJob.slug } />
          <Route component={ ApplyPage } path={ config.pages.bulkJob.slug } />
        </Route>

        <Route component={ AuthorizedExportPage } path={ config.pages.export.slug }>
          <Route component={ ExportPage } path={ config.pages.singleJob.slug } />
          <Route component={ ExportPage } path={ config.pages.bulkJob.slug } />
        </Route>

        <Route component={ AuthorizedOutputPage } path={ config.pages.embedded.output.slug }>
          <Route component={ OutputPage } path=":tabSlug" />
        </Route>

        <Route component={ AuthorizedStatusPage } path={ config.pages.status.slug }/>

        <Route component={ AuthorizedMappingPage } path={ config.pages.mapping.slug }>
          <Route component={ MappingPage } path={ config.pages.rawData.slug } />
          <Route component={ MappingPage } path={ config.pages.editor.slug } />
        </Route>

        <Route component={ AuthorizedLogAnalyticsPage } path={ config.pages.embedded.logAnalytics.slug }/>

        <Route path={ config.pages.review.slug }>
          <IndexRoute component={ AuthorizedReviewPage }/>

          <Route component={ BulkJobRunnerPage } path={ config.pages.bulkJob.slug } />

          <Route component={ RedQueenPage } path={ config.pages.embedded.redQueen.slug }>
            <Route component={ RedQueenPage } path=":tabSlug" />
          </Route>

          <Route component={ DataReconciliationPage } path={ config.pages.embedded.dataReconciliation.slug }>
            <Route component={ DataReconciliationPage } path=":tabSlug" />
          </Route>

          <Route component={ ValidatorPage } path={ config.pages.embedded.validator.slug }>
            <Route component={ ValidatorPage } path=":tabSlug" />
          </Route>

          <Route component={ ModelDataValidationPage } path={ config.pages.embedded.modelDataValidation.slug } />
          <Route component={ DecisionTreePage } path={ config.pages.embedded.decisionTree.slug } />
          <Route component={ ControlFilesPage } path={ config.pages.embedded.controlFiles.slug } />

          <Route component={ TableStatisticsPage } path={ config.pages.embedded.tableStatistics.slug }>
            <Route component={ TableStatisticsPage } path=":tabSlug" />
          </Route>
        </Route>
      </Route>
    </Route>

    <Route component={ NotFoundPage } path="*"/>
  </Route>
);
