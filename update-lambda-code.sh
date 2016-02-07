#!/bin/bash

LAMBDA_NAME=$1
AWS_PROFILE_NAME=$2

if [ "$LAMBDA_NAME" == "" ] ; then
  echo Please specify the name of lambda function
  exit 1
fi

LAMBDA_DIR=lambda-$LAMBDA_NAME
if ! [ -d "$LAMBDA_DIR" ] ; then
  echo "Make sure there is \"$LAMBDA_DIR\" directory"
  exit 1
fi

if [ "$AWS_PROFILE_NAME" != "" ] ; then
  AWS_PROFILE_OPT="--profile $AWS_PROFILE_NAME"
fi

echo Compressing lambda function...
UPLOAD_ZIP_NAME=${LAMBDA_NAME}.zip
zip -r -j $UPLOAD_ZIP_NAME $LAMBDA_DIR

printf "Uploading compressed code...\n"
aws lambda update-function-code $AWS_PROFILE_OPT \
  --function-name $LAMBDA_NAME \
  --zip-file fileb://./$UPLOAD_ZIP_NAME
