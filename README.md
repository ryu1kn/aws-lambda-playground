
# aws-lambda-playground

It's actually AWS lambda function uploader with one sample lambda. Not the playground of lambda itself...

## Edit your lambda

Put your lambda code and the config for it in `lambdas` directory.

If you have `hello-world` lambda, you should have:

* `lambdas/hello-world`: Your lambda code
* `lambdas/hello-world.json`: Configuration for your lambda

Your lambda config should have the following content:

```json
{
  "handler": "YOUR HANDLER",
  "execution_role": "arn:aws:iam::999999999999:role/LAMBDA_EXECUTION_ROLE_NAME"
}
```

When your lambda is ready, upload it with the following command.

```sh
$ node --harmony_rest_parameter upload-lambda.js --function-name YOUR_LAMBDA_NAME
```

## Settings

`app.conf` should have the following values

```json
{
  "aws.accessKeyId": "AWS ACCESS KEY ID",
  "aws.secretAccessKey": "AWS SECRET ACCESS KEY",
  "aws.region": "AWS REGION"
}
```

## Sample Execution

```sh
$ aws lambda invoke --function-name YOUR_LAMBDA_NAME [--payload PAYLOAD] [--profile AWS_PROFILE_NAME] /dev/stdout
```
