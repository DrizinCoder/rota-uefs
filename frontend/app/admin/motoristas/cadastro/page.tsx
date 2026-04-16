"use client";

import { Suspense } from "react";
import CadastroMotoristaForm from "./cadastro"; 

export default function PaginaCadastroMotorista() {
  return (
    <Suspense fallback={<div>A carregar...</div>}>
      <CadastroMotoristaForm />
    </Suspense>
  );
}