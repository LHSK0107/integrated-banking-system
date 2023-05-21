echo "ApplicationStart stage!!!!!!!"

jarname="iam-0.0.1-SNAPSHOT"

# 프로세스 id 얻기
pid=$(ps -ef | grep $jarname | grep -v grep | awk '{ print $2 }')

# 프로세스 id가 존재하면 종료
if [ -n "$pid" ]; then
    echo "Killing process with id: $pid"
    kill $pid
else
    echo "No running process found for $jarname"
fi

nohup java -jar /home/ubuntu/github_action/iam-0.0.1-SNAPSHOT.jar > /home/ubuntu/logfile.out 2>&1 &
