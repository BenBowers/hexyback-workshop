---
sidebar_position: 3
tags:
  - setup aws docker dev-container vscode
---

# Development Environment

## Github Codespaces

We recommend that you run the workshop on GitHub Codespaces. If you haven't done so already, open the workshop on GitHub Codespaces:

- [![Open the project in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/BenBowers/hexyback-workshop?quickstart=1)

## Configuring the AWS CLI with IAM Credentials

We are now working inside a development container where the AWS CLI has been preinstalled. Follow these steps to configure the AWS CLI with your IAM credentials:

### Step 1: Prepare Your IAM Credentials

Before starting the configuration process, ensure you have your IAM credentials ready. These consist of:

- **AWS Access Key ID**
- **AWS Secret Access Key**

These credentials should have been obtained when you [created your IAM user previously](./intro#setting-up-aws-access). If you have not created an IAM user or lost your credentials, you will need to create a new IAM user and download the credentials.

### Step 2: Open Your Development Container's Terminal

1. Access the integrated terminal in your development environment. This is typically done by opening the command palette (usually Ctrl+Shift+P or Cmd+Shift+P on Mac) and selecting `Terminal: Create New Integrated Terminal` or by navigating to the terminal panel in your IDE.

### Step 3a: Configure the AWS CLI (IAM User)

1. In the terminal, type the following command and hit Enter:

   ```bash
   aws configure
   ```

2. When prompted, enter your **AWS Access Key ID** and hit Enter.
3. Next, enter your **AWS Secret Access Key** and hit Enter.
4. For the **Default region name**, enter the AWS Region you will be working in: `ap-southeast-2`. Press Enter.
5. For the **Default output format**, enter `json` (this is the most common format). Press Enter.

   Here's an example of how the prompts might look:

   ```text
   AWS Access Key ID [None]: AKIAIOSFODNN7EXAMPLE
   AWS Secret Access Key [None]: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
   Default region name [None]: ap-southeast-2
   Default output format [None]: json
   ```

6. (Optional) If you credentials inlude an _AWS session token_, you'll need configure your profile to use it. In the same terminal, type the following command and hit Enter:

   ```bash
   aws configure set aws_session_token AWS_SESSION_TOKEN #Replace AWS_SESSION_TOKEN with the session token from your credentials
   ```

### Step 3b: Configure the AWS CLI (SSO)

1. Run SSO configuration command

   ```bash
   aws configure sso
   ```

2. When prompted to enter you session name **Leave Blank** and hit Enter.
3. Next enter your **SSO start URL** i.e `https://hexy.awsapps.com/start/#/` and hit enter
4. For the **SSO Region** set `ap-southeast-2`
5. You will be prompted to open your browser. Log in and confirm the connection
6. Select your account and role
7. Set the **CLI default region** to `ap-southeast-2`
8. Set the **CLI default output format** to `json`
9. Set the **CLI profile name** to `default` if in the container or set it to a sensible name if running on your machine (You will need to export your profile if not set to default)

   Here's an example of what the prompts might look like

   ```text
   node ➜ /workspaces/hexyback-workshop/backend (update-sso-instructions) $ aws configure sso
   SSO session name (Recommended):
   WARNING: Configuring using legacy format (e.g. without an SSO session).
   Consider re-running "configure sso" command and providing a session name.
   SSO start URL [None]: https://<org>.awsapps.com/start/#/
   SSO region [None]: ap-southeast-2
   Attempting to automatically open the SSO authorization page in your default browser.
   If the browser does not open or you wish to use a different device to authorize this request, open the following URL:

   https://device.sso.ap-southeast-2.amazonaws.com/

   Then enter the code:

   XXXX-XXXX
   There are 85 AWS accounts available to you.
   Using the account ID 111111111111
   There are 4 roles available to you.
   Using the role name "AdministratorAccess"
   CLI default client Region [None]: ap-southeast-2
   CLI default output format [None]: json
   CLI profile name [AdministratorAccess-1111111111]: default
   ```

### Step 4: Verify Configuration

To ensure that your AWS CLI is configured correctly with your new IAM credentials, you can run a simple AWS CLI command to list the S3 buckets in your account:

```bash
aws s3 ls
```

If the AWS CLI is configured correctly, you should see a list of S3 buckets in your account (or an empty list if no buckets have been created). If you receive an error, verify that you entered your credentials and settings correctly in the previous steps.

## Running the Application 🛠️

### Checkout the workshop branch

```sh
git checkout workshop-start
```

### Install the dependencies

```sh
pnpm i
```

### Start the docs

```sh
pnpm run docs
```

### Deploy the application

```sh
pnpm run deploy
```

### Run the tests

#### Unit

```sh
pnpm run test
```

#### Integration

```sh
pnpm run test:integration
```
