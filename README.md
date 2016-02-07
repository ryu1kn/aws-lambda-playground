
# aws-lambda-playground

## Edit your lambda

Suppose you already have lambda `YOUR_LAMBDA_NAME` in your account.
Download the zipped lambda file, unzip and put the directory in the project root with the name `lambda-YOUR_LAMBDA_NAME`.

After you modify the code, upload it with the following command.

```sh
$ ./update-lambda-code.sh YOUR_LAMBDA_NAME [AWS_PROFILE_NAME]
```

## Execution

```sh
$ aws lambda invoke --function-name YOUR_LAMBDA_NAME [--payload PAYLOAD] [--profile AWS_PROFILE_NAME] /dev/stdout
```
