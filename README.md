# TalentSpace Serverless Backend

### Prepare before you go
1. Node 6.10 or higher
2. NPM
4. Any IDE with eslint plugin
5. Install Serverless Framework
   `npm install -g serverless`
5. Install the AWS CLI with Homebrew
   `brew install awscli`
6. Configure your [AWS Credentials](http://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html#cli-config-files)

### Getting started
1. Move to project directory and run
   `npm install`
2. Start with command `npm run start`. It will use `serverless-offline` plugin and run at port 3000

### AWS account deployment
1. Request and configure a DEV aws account [IAM user credentials](http://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html#Using_CreateAccessKey)

2. Deploy

```sh
npm run deploy:[STAGE]
```

```stage``` option will be used to deploy service with specific stage. Allowed stages are: `dev, uat, prod`

For example if your serverless.yml service name is ```myService``` and your function name is ```myFunction```.
Then a ```serverless deploy --stage dev --user MyName``` will deploy a lambda named ```myServiceMyName-dev-myfunction```.

