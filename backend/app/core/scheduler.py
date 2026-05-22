import os
import logging
import datetime
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.jobstores.sqlalchemy import SQLAlchemyJobStore

from app.core.config import settings
from app.utils.utils import generate_unique_id

logger = logging.getLogger(__name__)

class TaskScheduler:
    def __init__(self):
        self.data_dir = "/app/app/database/scheduler_data"
        os.makedirs(self.data_dir, exist_ok=True)
        
        db_path = os.path.join(self.data_dir, "jobs.sqlite")
        
        jobstores = {
            'default': SQLAlchemyJobStore(url=f"sqlite:///{db_path}")
        }
        
        self.scheduler = BackgroundScheduler(jobstores=jobstores)

    def start(self):
        if not self.scheduler.running:
            self.scheduler.start()
            logger.info("⏰ APScheduler iniciado com armazenamento persistente.")

    def shutdown(self):
        if self.scheduler.running:
            self.scheduler.shutdown()
            logger.info("⏰ APScheduler desligado com sucesso.")

    def schedule_task(self, func, date: datetime.datetime, *args, minutes_notice: int = settings.MINUTES_NOTICE, misfire_grace_time: int = settings.MISFIRE_GRACE_TIME, **kwargs):
        now = datetime.datetime.now()

        trigger_time = date - datetime.timedelta(minutes=minutes_notice)
        
        if now > trigger_time:
            logger.warning(
                f"⚠️ Não foi possível agendar task'. "
                f"O horário de disparo calculado ({trigger_time.strftime('%d/%m/%Y %H:%M:%S')}) "
                f"já passou. (Horário atual: {now.strftime('%d/%m/%Y %H:%M:%S')})"
            )
            return None
            
        job_id = generate_unique_id()
        job = self.scheduler.add_job(
            func=func,
            trigger='date',
            run_date=trigger_time,
            args=args,
            kwargs=kwargs,
            id=job_id,
            replace_existing=True,
            misfire_grace_time=misfire_grace_time  
        )
        
        logger.info(f"📌 Tarefa '{job_id}' agendada com sucesso para rodar em: {trigger_time.strftime('%d/%m/%Y %H:%M:%S')}")
        return job
    
task_scheduler = TaskScheduler()