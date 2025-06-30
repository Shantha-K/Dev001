pipeline {
    agent any

    environment {
        AWS_ACCESS_KEY_ID = credentials('aws-access-key-id')
        AWS_SECRET_ACCESS_KEY = credentials('aws-secret-access-key')
        AWS_REGION = 'ap-south-1'
        S3_BUCKET = 'elasticbeanstalk-ap-south-1-907591395244'
        APPLICATION_NAME = 'EBS-adavu'
        ENVIRONMENT_NAME = 'EBS-adavu-env'
        VERSION_LABEL = "build-${env.BUILD_NUMBER}"
        AWS_CLI = "\"C:\\Program Files\\Amazon\\AWSCLIV2\\aws.exe\""
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'master', url: 'https://github.com/Shantha-K/Dev001.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm install'
            }
        }

        stage('Package') {
            steps {
                bat "powershell Compress-Archive -Path * -DestinationPath ${env.VERSION_LABEL}.zip"
            }
        }

        stage('Upload to S3') {
            steps {
                bat "${env.AWS_CLI} s3 cp ${env.VERSION_LABEL}.zip s3://${S3_BUCKET}/"
            }
        }

        stage('Deploy to Elastic Beanstalk') {
            steps {
                // Create application version
                bat "${env.AWS_CLI} elasticbeanstalk create-application-version --application-name ${APPLICATION_NAME} --version-label ${env.VERSION_LABEL} --source-bundle S3Bucket=${S3_BUCKET},S3Key=${env.VERSION_LABEL}.zip --region ${AWS_REGION}"

                // Wait until the environment is ready
                script {
                    def maxRetries = 20
                    def sleepTime = 30 // seconds

                    for (int i = 0; i < maxRetries; i++) {
                        def result = bat(
                            script: "${env.AWS_CLI} elasticbeanstalk describe-environments --application-name ${APPLICATION_NAME} --environment-names ${ENVIRONMENT_NAME} --region ${AWS_REGION}",
                            returnStdout: true
                        ).trim()

                        if (result.contains('"Status": "Ready"')) {
                            echo "Environment is Ready"
                            break
                        } else {
                            echo "Environment not ready yet, waiting ${sleepTime} seconds... (attempt ${i + 1}/${maxRetries})"
                            sleep sleepTime
                        }

                        if (i == maxRetries - 1) {
                            error "Environment did not become ready in time. Aborting deployment."
                        }
                    }
                }

                // Update environment after it's ready
                bat "${env.AWS_CLI} elasticbeanstalk update-environment --environment-name ${ENVIRONMENT_NAME} --version-label ${env.VERSION_LABEL} --region ${AWS_REGION}"
            }
        }
    }

    post {
        success {
            echo "✅ Successfully deployed ${env.VERSION_LABEL} to ${ENVIRONMENT_NAME}"
        }
        failure {
            echo "❌ Deployment failed"
        }
    }
}
