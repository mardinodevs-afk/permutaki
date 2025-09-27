
import { storage } from "./storage";
import bcrypt from "bcryptjs";

async function createAdminUser() {
  try {
    const adminData = {
      firstName: "Administrador",
      lastName: "Sistema",
      sector: "Administração",
      salaryLevel: 21,
      grade: "A",
      currentProvince: "Maputo Cidade",
      currentDistrict: "Matola",
      desiredProvince: "Maputo Cidade", 
      desiredDistrict: "Matola",
      phone: "+258840000000",
      email: "admin@permutaki.mz",
      password: await bcrypt.hash("Admin@123", 10),
      isAdmin: true,
      isPremium: true,
      isActive: true
    };

    // Check if admin already exists
    const existingAdmin = await storage.getUserByPhone(adminData.phone);
    if (existingAdmin) {
      console.log("Usuário administrador já existe!");
      console.log("Telefone:", adminData.phone);
      console.log("Senha: Admin@123");
      return;
    }

    const newAdmin = await storage.insertUser(adminData);
    console.log("Usuário administrador criado com sucesso!");
    console.log("ID:", newAdmin.id);
    console.log("Nome:", `${newAdmin.firstName} ${newAdmin.lastName}`);
    console.log("Telefone:", newAdmin.phone);
    console.log("Senha: Admin@123");
    console.log("É Admin:", newAdmin.isAdmin);
    
  } catch (error) {
    console.error("Erro ao criar usuário administrador:", error);
  }
}

createAdminUser();
