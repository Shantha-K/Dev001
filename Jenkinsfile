pipeline {
    agent any

    environment {
        AWS_ACCESS_KEY_ID = credentials('aws-access-key-id')
        AWS_SECRET_ACCESS_KEY = credentials('aws-secret-access-key')
        AWS_REGION = 'ap-south-1'
        S3_BUCKET = 'elasticbeanstalk-ap-south-1-907591395244 '
        APPLICATION_NAME = 'EBS-adavu'
        ENVIRONMENT_NAME = 'EBS-adavu-env'
        VERSION_LABEL = "build-${env.BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/Shantha-K/Dev001.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm install'
            }
        }

        stage('Package') {
            steps {
                bat 'powershell Compress-Archive -Path * -DestinationPath %VERSION_LABEL%.zip'

            }
        }

        stage('Upload to S3') {
            steps {
                bat "aws s3 cp ${VERSION_LABEL}.zip s3://${S3_BUCKET}/"
            }
        }

        stage('Deploy to Elastic Beanstalk') {
            steps {
                bat """
                aws elasticbeanstalk create-application-version ^
                    --application-name ${APPLICATION_NAME} ^
                    --version-label ${VERSION_LABEL} ^
                    --source-bundle S3Bucket=${S3_BUCKET},S3Key=${VERSION_LABEL}.zip ^
                    --region ${AWS_REGION}

                aws elasticbeanstalk update-environment ^
                    --environment-name ${ENVIRONMENT_NAME} ^
                    --version-label ${VERSION_LABEL} ^
                    --region ${AWS_REGION}
                """
            }
        }
    }

    post {
        success {
            echo " Successfully deployed ${VERSION_LABEL} to ${ENVIRONMENT_NAME}"
        }
        failure {
            echo " Deployment failed"
        }
    }
}