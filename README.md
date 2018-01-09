# Mongoose for Application Development
https://www.safaribooksonline.com/library/view/mongoose-for-application/9781782168195/index.html

# insert manually
> db.workhours.insert({"startOrEnd":"START", "time" : ISODate("2017-05-28T05:56:23.465Z")})


# auto log start/end ... add entry on suspend or resume action
sample below posts to local mongodb server. todo: use external in some secure way

/etc/pm/sleep.d/99_log-work-hours

#!/bin/sh



function log() {
    logger -t 99log-work-hours `date +"%F %R"` "$*"
}

case "$1" in
    suspend)
        log "WORK_END"
	# assume we end our work at the office
	curl -d 'startOrEnd=END' localhost:3030/workhour
        ;;

    resume)
        log "WORK_START"
	# assume we start working in the morning
	curl -d 'startOrEnd=START' localhost:3030/workhour
	;;
esac
