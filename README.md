
# Lambda Uploader

It's actually AWS lambda function uploader with one sample lambda. Not the playground of lambda itself...

Put your lambdas in one directory (e.g. `my_lambdas`). Here `lambda_N` must be your lambda names.

```
* my_lambdas/
    * lambda_1/
        * dest/ (contents of `dest` directory will be zipped)
        * config.json
    * lambda_2/
        * ...
```

Each `config.json` should have following values:

```json
{
  "handler": "YOUR HANDLER",
  "execution_role": "arn:aws:iam::999999999999:role/LAMBDA_EXECUTION_ROLE_NAME"
}
```

If you want to upload your `lambda_1`, execute the following command:

```sh
$ node --harmony_rest_parameters upload-lambda.js --function-name YOUR_LAMBDA_NAME --config CONFIG_PATH
```

Here, CONFIG_PATH is the path to a file containing the following information:

```json
{
  "aws.accessKeyId": "AWS ACCESS KEY ID",
  "aws.secretAccessKey": "AWS SECRET ACCESS KEY",
  "aws.region": "AWS REGION",

  "lambda.directory.path": "path/to/lambda_dir"
}
```

## Sample Execution

```sh
$ aws lambda invoke --function-name YOUR_LAMBDA_NAME [--payload PAYLOAD] [--profile AWS_PROFILE_NAME] /dev/stdout
```
