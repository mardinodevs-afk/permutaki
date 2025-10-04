
import { storage } from "./storage";
import bcrypt from "bcryptjs";

async function createAdminUser() {
  try {
    // Administrador Principal (Oculto)
    const adminData = {
      firstName: "Administrador",
      lastName: "Oculto",
      sector: "Administração do Sistema",
      salaryLevel: 21,
      grade: "A",
      currentProvince: "Maputo Cidade",
      currentDistrict: "KaMpfumo",
      desiredProvince: "Maputo Cidade", 
      desiredDistrict: "KaMpfumo",
      phone: "+258840000000",
      email: "admin@permutaki.mz",
      password: await bcrypt.hash("Admin@2025", 10),
      isAdmin: true,
      isPremium: true,
      isActive: true
    };

    // Assistente de Permuta (Oculto)
    const assistantData = {
      firstName: "Assistente",
      lastName: "Permuta",
      sector: "Gestão de Permutas",
      salaryLevel: 21,
      grade: "A",
      currentProvince: "Maputo Cidade",
      currentDistrict: "KaMpfumo",
      desiredProvince: "Maputo Cidade", 
      desiredDistrict: "KaMpfumo",
      phone: "+258870000001",
      email: "assistente@permutaki.mz",
      password: await bcrypt.hash("Assistente@2025", 10),
      isAdmin: true,
      isPremium: true,
      isActive: true
    };

    // Check if main admin already exists
    const existingAdmin = await storage.getUserByPhone(adminData.phone);
    if (!existingAdmin) {
      const newAdmin = await storage.insertUser(adminData);
      console.log("✓ Administrador Principal criado!");
      console.log("  Telefone:", newAdmin.phone);
      console.log("  Senha: Admin@2025");
    } else {
      console.log("✓ Administrador Principal já existe");
      console.log("  Telefone:", adminData.phone);
      console.log("  Senha: Admin@2025");
    }

    // Check if assistant admin already exists
    const existingAssistant = await storage.getUserByPhone(assistantData.phone);
    if (!existingAssistant) {
      const newAssistant = await storage.insertUser(assistantData);
      console.log("\n✓ Assistente de Permuta criado!");
      console.log("  Telefone:", newAssistant.phone);
      console.log("  Senha: Assistente@2025");
    } else {
      console.log("\n✓ Assistente de Permuta já existe");
      console.log("  Telefone:", assistantData.phone);
      console.log("  Senha: Assistente@2025"025");
    }

    console.log("\n=== CREDENCIAIS DE ACESSO ===");
    console.log("\n🔐 Administrador Principal (Oculto):");
    console.log("  Telefone: +258840000000");
    console.log("  Senha: Admin@2025");
    console.log("  Nota: Não participa nas permutas");
    
    console.log("\n🔐 Assistente de Permuta (Oculto):");
    console.log("  Telefone: +258870000001");
    console.log("  Senha: Assistente@2025");
    console.log("  Nota: Não participa nas permutas");
    
  } catch (error) {
    console.error("Erro ao criar usuários administradores:", error);
  }
}

createAdminUser();
