Contributing Guide
===

Issues & Feature Requests
---

[![Create Issue](https://img.shields.io/badge/Github-Create_Issue-red.svg?style=for-the-badge&logo=github&logoColor=ffffff&logoWidth=16)](https://github.com/FindByColor/ar-marker-creator/issues/new/choose)

### Bug Fix

> We're sorry things are not working as expected, and want to get things fixed ASAP. In order to help us do that, we need a few things from you.

1. Create a [New Issue](https://github.com/FindByColor/ar-marker-creator/issues/new/choose)
2. Enter a Short but Descriptive Title for the Issue
3. Use the Template Provided and fill in as much as you can, if something does not apply, enter `N/A`
4. Look for the `Labels` section, and select `Bug Report` from the drop down menu
5. Click `Submit new issue` button

### Feature Request

> Got an idea for a new feature? We'd love to hear it! In order to get this knocked out, we will need a few things from you.

1. Create a [New Issue](https://github.com/FindByColor/ar-marker-creator/issues/new/choose)
2. Enter a Short but Descriptive Title for the Feature Request
3. Use the Template Provided and fill in as much as you can, if something does not apply, enter `N/A` ( you can delete the `Steps to Duplicate:` section as that does not apply )
4. Look for the `Labels` section, and select `Feature Request` from the drop down menu
5. Click `Submit new issue` button

Pull Requests
---

[![Create Pull Request](https://img.shields.io/badge/Github-Create_Pull_Request-blue.svg?style=for-the-badge&logo=github&logoColor=ffffff&logoWidth=16)](https://github.com/FindByColor/ar-marker-creator/compare)

### Bug Fix

> Each Bug Fix reported on GitHub should have its own `fix/*` branch.  The branch name should be formatted `fix/###-issue-name` where `###` is the GitHub Issue Number, and `issue-name` is a 1-3 word summary of the issue.

1. Checkout latest `develop` branch
2. Pull down the latest changes via `git pull`
3. Create a new branch with the structure `fix/*`, e.g. `fix/123-broken-form`
4. When you are ready to submit your code, submit a new Pull Request that merges your code into `develop`
5. Tag your new Pull Request with `Ready for Code Review`

### Feature Request

> Each New Feature should reside in its own `feature/` branch. The branch name should be formatted `feature/###-feature-name` where `###` is the GitHub Issue Number, and `feature-name` is a 1-3 word summary of the feature.

1. Checkout latest `develop` branch
2. Pull down the latest changes via `git pull`
3. Create a new branch with the structure `feature/*`, e.g. `feature/123-mobile-header`
4. When you are ready to submit your code, submit a new Pull Request that merges your code into `develop`
5. Tag your new Pull Request with `Ready for Code Review`

Updating API Documentation
---

> If you need to create or change any of the API Endpoints, you'll want to make sure the API documentation is updated as well before submitting a Pull Request.

Our API Documentation is contained in the `apiary.apib` found in the root folder.  This file uses a Special Documentation Format called a [Blueprint](https://help.apiary.io/api_101/api_blueprint_tutorial/). The `main` branch in GitHub is automatically synced with [https://findbycolor.docs.apiary.io](https://findbycolor.docs.apiary.io).

If you edit the file locally, you will probably want a way to preview the document while you are working on it.  Fortunately, Apiary has a tool to help with that ( you'll need to do this on your local machine, as this does not work in Docker yet ):

```bash
gem install apiaryio
```

Once you have `apiary` installed, you can run the following command in the root of the API folder.

```bash
apiary preview --server --watch --host=api.findbycolor.loc --port=8081
```

Then you can open the API Documentation Preview in your browser at [http://api.findbycolor.loc:8081](http://api.findbycolor.loc:8081) and it will automatically update as you make changes ( it does take it a second or so to compile each time ).
