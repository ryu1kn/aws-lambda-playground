
# aws-lambda-playground

## Edit your lambda

Put your lambda code in `lambdas` directory. If you have `hello-world` lambda,
it will be `lambdas/hello-world`.

After you modify your lambda, upload it with the following command.

```sh
$ node --harmony_rest_parameter upload-lambda.js --function-name YOUR_LAMBDA_NAME
```

## Settings

`app.conf` should have the following values

```json
{
  "aws.accessKeyId": "AWS ACCESS KEY ID",
  "aws.secretAccessKey": "AWS SECRET ACCESS KEY",
  "aws.region": "AWS REGION",

  "lambda.execution.role": "arn:aws:iam::999999999999:role/LAMBDA_EXECUTION_ROLE_NAME"
}
```

## Execution

```sh
$ aws lambda invoke --function-name YOUR_LAMBDA_NAME [--payload PAYLOAD] [--profile AWS_PROFILE_NAME] /dev/stdout
```
