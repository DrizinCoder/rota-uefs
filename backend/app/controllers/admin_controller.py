from app.DTOs.auth import MotoristaRegisterResponseDTO,RegisterMotoristaDTO
import uuid
from app.DTOs.auth import RegisterAdminDTO
from app.DTOs.users import CreateAdminDTO
from app.services.admin_service import AdminService
import logging

logger = logging.getLogger(__name__)

class AdminController:
    def __init__(self, service: AdminService):
        self.service = service
            
    async def create(self, dados: RegisterAdminDTO):
        logger.info(f"Admin creation requested | Email: {dados.email}")

        admin_data = CreateAdminDTO(
            full_name=dados.full_name,
            registration_id=dados.registration_id,
            phone=dados.phone or "Not Defined",
            email=dados.email,
            password=dados.password or "default_password",
            profile=dados.profile,
            access_level=dados.access_level.value if dados.access_level else "Operator"
        )
        
        admin = await self.service.create_admin(admin_data)

        logger.info(f"Admin created successfully | Email: {dados.email}")
        return self.service.serialize_admin_response(admin)
    
    async def list_all(self):
        logger.info("Admin list requested")

        admins = await self.service.get_alls_admins()
        if not admins:
            logger.info("Admin list retrieved successfully | Count: 0")
            return []

        logger.info(f"Admin list retrieved successfully | Count: {len(admins)}")
        return self.service.serialize_admin_list(admins)

    async def get_driver(self, driver_id: uuid.UUID):
        logger.info(f"Driver info requested | Driver ID: {driver_id}")

        result = await self.service.get_driver(driver_id)

        logger.info(f"Driver info retrieved successfully | Driver ID: {driver_id}")
        return result

    async def get_by_id(self, admin_id: uuid.UUID):
        logger.info(f"Admin detail requested | Admin ID: {admin_id}")

        admin = await self.service.get_admin_by_id(admin_id)
        if not admin:
            logger.info(f"Admin not found | Admin ID: {admin_id}")
            return None

        logger.info(f"Admin detail retrieved successfully | Admin ID: {admin_id}")
        return self.service.serialize_admin_detail(admin)

    async def update(self, admin_id: uuid.UUID, update_data: dict):
        logger.info(f"Admin update requested | Admin ID: {admin_id}")

        admin = await self.service.update_admin(admin_id, update_data)
        if not admin:
            logger.info(f"Admin not found for update | Admin ID: {admin_id}")
            return None

        logger.info(f"Admin updated successfully | Admin ID: {admin_id}")
        return self.service.serialize_admin_update(admin)

    async def delete(self, admin_id: uuid.UUID):
        logger.info(f"Admin deletion requested | Admin ID: {admin_id}")

        result = await self.service.delete_admin(admin_id)

        logger.info(f"Admin deleted successfully | Admin ID: {admin_id}")
        return result

    async def register_motorista(self, dados: RegisterMotoristaDTO):
        logger.info(f"Driver registration requested | Email: {dados.email}")

        driver, temp_password = await self.service.register_motorista(dados)
        
        response = MotoristaRegisterResponseDTO.model_validate(driver)
        response_dict = response.model_dump(mode='json')
        response_dict["temp_password"] = temp_password

        logger.info(f"Driver registered successfully | Email: {dados.email}")
        return response_dict

    async def delete_account(self, user_id: uuid.UUID):
        logger.info(f"Account deletion requested | User ID: {user_id}")

        result = await self.service.delete_account(user_id)

        logger.info(f"Account deleted successfully | User ID: {user_id}")
        return result

    async def list_drivers(self):
        logger.info("Drivers list requested")

        result = await self.service.list_drivers()

        logger.info(f"Drivers list retrieved successfully | Count: {len(result) if result else 0}")
        return result

    async def list_staff_status_pending(self):
        logger.info("Pending staff list requested")

        result = await self.service.list_staff_status_pending()

        logger.info(f"Pending staff list retrieved successfully | Count: {len(result) if result else 0}")
        return result

    async def update_status_staff(self, user_id: uuid.UUID, status: bool):
        logger.info(f"Staff status update requested | User ID: {user_id} | Status: {status}")

        result = await self.service.update_status_staff(user_id, status)

        logger.info(f"Staff status updated successfully | User ID: {user_id} | Status: {status}")
        return result