
import { storage } from "./storage";
import bcrypt from "bcryptjs";

async function createAdminUser() {
  try {
    // Admin principal
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
      masterKey: "ADM123",
      isAdmin: true,
      isPremium: true,
      isActive: true
    };

    // Admin oculto para permutas
    const hiddenAdminData = {
      firstName: "Coordenador",
      lastName: "Permutas",
      sector: "Recursos Humanos",
      salaryLevel: 21,
      grade: "A",
      currentProvince: "Maputo Cidade",
      currentDistrict: "KaMpfumo",
      desiredProvince: "Maputo Cidade", 
      desiredDistrict: "KaMpfumo",
      phone: "+258870000001",
      email: "permutas@permutaki.mz",
      password: await bcrypt.hash("Permuta@2025", 10),
      masterKey: "PRM258",
      isAdmin: true,
      isPremium: true,
      isActive: true
    };

    // Check if main admin already exists
    const existingAdmin = await storage.getUserByPhone(adminData.phone);
    if (!existingAdmin) {
      const newAdmin = await storage.insertUser(adminData);
      console.log("✓ Administrador principal criado!");
      console.log("  Telefone:", newAdmin.phone);
      console.log("  Senha: Admin@123");
      console.log("  Chave Mestra:", adminData.masterKey);
    } else {
      console.log("✓ Administrador principal já existe");
      console.log("  Telefone:", adminData.phone);
      console.log("  Senha: Admin@123");
    }

    // Check if hidden admin already exists
    const existingHiddenAdmin = await storage.getUserByPhone(hiddenAdminData.phone);
    if (!existingHiddenAdmin) {
      const newHiddenAdmin = await storage.insertUser(hiddenAdminData);
      console.log("\n✓ Admin Oculto de Permutas criado!");
      console.log("  Telefone:", newHiddenAdmin.phone);
      console.log("  Senha: Permuta@2025");
      console.log("  Chave Mestra:", hiddenAdminData.masterKey);
    } else {
      console.log("\n✓ Admin Oculto de Permutas já existe");
      console.log("  Telefone:", hiddenAdminData.phone);
      console.log("  Senha: Permuta@2025");
    }

    console.log("\n=== CREDENCIAIS DE ACESSO ===");
    console.log("\nAdmin Principal:");
    console.log("  Telefone: +258840000000");
    console.log("  Senha: Admin@123");
    console.log("  Chave Mestra: ADM123");
    
    console.log("\nAdmin Oculto (Permutas):");
    console.log("  Telefone: +258870000001");
    console.log("  Senha: Permuta@2025");
    console.log("  Chave Mestra: PRM258");
    
  } catch (error) {
    console.error("Erro ao criar usuários administradores:", error);
  }
}

createAdminUser();
