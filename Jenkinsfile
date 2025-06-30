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
                bat "powershell Compress-Archive -Path * -DestinationPath ${env.VERSION_LABEL}.zip"
            }
        }

        stage('Upload to S3') {
            steps {
                bat "\"C:\\Program Files\\Amazon\\AWSCLIV2\\aws.exe\" s3 cp ${env.VERSION_LABEL}.zip s3://${S3_BUCKET}/"
            }
        }

        stage('Deploy to Elastic Beanstalk') {
            steps {
                bat "\"C:\\Program Files\\Amazon\\AWSCLIV2\\aws.exe\" elasticbeanstalk create-application-version --application-name ${APPLICATION_NAME} --version-label ${env.VERSION_LABEL} --source-bundle S3Bucket=${S3_BUCKET},S3Key=${env.VERSION_LABEL}.zip --region ${AWS_REGION}"

                script {
                    def ready = false
                    while(!ready) {
                        def status = bat(
                            script: "\"C:\\Program Files\\Amazon\\AWSCLIV2\\aws.exe\" elasticbeanstalk describe-environments --environment-names ${ENVIRONMENT_NAME} --query 'Environments[0].Status' --output text --region ${AWS_REGION}",
                            returnStdout: true
                        ).trim()

                        echo "Elastic Beanstalk Environment Status: ${status}"

                        if (status == 'Ready') {
                            ready = true
                        } else {
                            echo "Waiting 30 seconds for environment to be Ready..."
                            sleep 30
                        }
                    }
                }

                bat "\"C:\\Program Files\\Amazon\\AWSCLIV2\\aws.exe\" elasticbeanstalk update-environment --environment-name ${ENVIRONMENT_NAME} --version-label ${env.VERSION_LABEL} --region ${AWS_REGION}"
            }
        }
    }

    post {
        success {
            echo "Successfully deployed ${env.VERSION_LABEL} to ${ENVIRONMENT_NAME}"
        }
        failure {
            echo "Deployment failed"
        }
    }
}
