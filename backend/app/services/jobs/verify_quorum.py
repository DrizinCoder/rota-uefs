import asyncio
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

def verify_quorum(menssage: str = "Olá, mundo!", executor: str = "Sistema"):
    logger.info(f" ⏳ [JOB STARTED")
    
    async def async_block():
        logger.info(f"🔥 [ASYNC INSIDE CLASS EXECUTED] Método async rodou com sucesso!")
        
    asyncio.run(async_block())
    
    logger.info(f"💥 [JOB CONCLUDED] Alarme processado em: {datetime.now().strftime('%d/%m/%Y %H:%M:%S')}")


def verify_quorum_test(menssage: str = "Olá, mundo!", executor: str = "Sistema"):
    logger.info(f" ⏳ [JOB STARTED")
    
    async def async_block():
        logger.info(f"🔥 [ASYNC INSIDE CLASS EXECUTED] Método async rodou com sucesso! executor: {executor}")
        
    asyncio.run(async_block())
    
    logger.info(f"💥 [JOB CONCLUDED] Alarme processado em: {datetime.now().strftime('%d/%m/%Y %H:%M:%S')}")
