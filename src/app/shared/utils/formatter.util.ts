/**
 * Classe utilitária estática para formatação de dados
 */
export class FormatterUtil {
  /**
   * Formata CPF para exibição (XXX.XXX.XXX-XX)
   */
  static formatarCpf(cpf: string | null | undefined): string {
    if (!cpf) {
      return '';
    }
    const cleaned = cpf.replace(/\D/g, '');
    if (cleaned.length !== 11) {
      return cpf;
    }
    return cleaned.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
  }

  /**
   * Formata CPF progressivamente durante a digitação (aplica máscara conforme o usuário digita)
   * @param cpf - String com apenas números (sem formatação)
   * @returns String formatada progressivamente (ex: "123" -> "123", "1234" -> "123.4", etc)
   */
  static formatarCpfProgressivo(cpf: string): string {
    if (!cpf) {
      return '';
    }

    // Limita a 11 dígitos
    const limitedValue = cpf.substring(0, 11);

    // Aplica máscara progressiva
    let maskedValue = limitedValue;
    if (limitedValue.length > 3) {
      maskedValue = `${limitedValue.substring(0, 3)}.${limitedValue.substring(3)}`;
    }
    if (limitedValue.length > 6) {
      maskedValue = `${limitedValue.substring(0, 3)}.${limitedValue.substring(3, 6)}.${limitedValue.substring(6)}`;
    }
    if (limitedValue.length > 9) {
      maskedValue = `${limitedValue.substring(0, 3)}.${limitedValue.substring(3, 6)}.${limitedValue.substring(6, 9)}-${limitedValue.substring(9)}`;
    }

    return maskedValue;
  }

  /**
   * Formata CNPJ para exibição (XX.XXX.XXX/XXXX-XX)
   */
  static formatarCnpj(cnpj: string | null | undefined): string {
    if (!cnpj) {
      return '';
    }
    const cleaned = cnpj.replace(/\D/g, '');
    if (cleaned.length !== 14) {
      return cnpj;
    }
    return cleaned.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
  }

  /**
   * Formata telefone para exibição
   * Suporta formatos: (XX) XXXX-XXXX ou (XX) XXXXX-XXXX
   */
  static formatarTelefone(telefone: string | null | undefined): string {
    if (!telefone) {
      return '';
    }
    const cleaned = telefone.replace(/\D/g, '');

    if (cleaned.length === 10) {
      // Formato: (XX) XXXX-XXXX
      return cleaned.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
    } else if (cleaned.length === 11) {
      // Formato: (XX) XXXXX-XXXX
      return cleaned.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
    }

    return telefone;
  }

  /**
   * Formata telefone para display (alias para formatarTelefone)
   */
  static formatarTelefoneDisplay(telefone: string | null | undefined): string {
    return FormatterUtil.formatarTelefone(telefone);
  }

  /**
   * Formata CPF para display (usado em contextos específicos)
   */
  static formatarCpfDisplay(cpf: string | null | undefined): string {
    return FormatterUtil.formatarCpf(cpf);
  }

  /**
   * Formata CEP para exibição (XXXXX-XXX)
   */
  static formatarCep(cep: string | null | undefined): string {
    if (!cep) {
      return '';
    }
    const cleaned = cep.replace(/\D/g, '');
    if (cleaned.length !== 8) {
      return cep;
    }
    return cleaned.replace(/^(\d{5})(\d{3})$/, '$1-$2');
  }

  /**
   * Remove formatação de CPF (retorna apenas números)
   */
  static limparCpf(cpf: string | null | undefined): string {
    if (!cpf) {
      return '';
    }
    return cpf.replace(/\D/g, '');
  }

  /**
   * Remove formatação de CNPJ (retorna apenas números)
   */
  static limparCnpj(cnpj: string | null | undefined): string {
    if (!cnpj) {
      return '';
    }
    return cnpj.replace(/\D/g, '');
  }

  /**
   * Remove formatação de telefone (retorna apenas números)
   */
  static limparTelefone(telefone: string | null | undefined): string {
    if (!telefone) {
      return '';
    }
    return telefone.replace(/\D/g, '');
  }

  /**
   * Remove todos os caracteres não numéricos de uma string
   * Método genérico para limpeza de qualquer string
   */
  static apenasNumeros(valor: string | null | undefined): string {
    if (!valor) {
      return '';
    }
    return valor.replace(/\D/g, '');
  }

  /**
   * Remove espaços em branco de uma string
   */
  static removerEspacos(valor: string | null | undefined): string {
    if (!valor) {
      return '';
    }
    return valor.replace(/\s/g, '');
  }

  /**
   * Remove acentos de uma string
   */
  static removerAcentos(valor: string | null | undefined): string {
    if (!valor) {
      return '';
    }
    return valor.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  /**
   * Normaliza uma string para busca/comparação
   * Remove acentos, converte para minúsculas e substitui múltiplos espaços em branco por um único espaço
   * @param valor - String a ser normalizada
   * @returns String normalizada (lowercase, sem acentos e com espaços únicos)
   */
  static normalizarParaBusca(valor: string | null | undefined): string {
    if (!valor) {
      return '';
    }
    return valor
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/\s+/g, ' ');
  }

  /**
   * Normaliza uma string para comparação de duplicidade
   * Remove espaços, converte para minúsculas e remove acentos
   * Útil para validar se dois textos são iguais ignorando diferenças de formatação
   * @param valor - String a ser normalizada
   * @returns String normalizada (lowercase, sem acentos e sem espaços nas extremidades)
   * @example
   * normalizarTexto('  São José  ') === normalizarTexto('sao jose') // true
   * normalizarTexto('Espírito Santo') === normalizarTexto('espirito santo') // true
   */
  static normalizarTexto(valor: string | null | undefined): string {
    if (!valor) {
      return '';
    }
    return valor
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  /**
   * Formata valor numérico para moeda brasileira (R$ 1.234,56)
   * @param valor - Valor numérico ou string
   * @returns String formatada no padrão brasileiro (R$ 0,00)
   */
  static formatarMoedaBrasileira(valor: number | string | null | undefined): string {
    if (valor === null || valor === undefined || valor === '') {
      return 'R$ 0,00';
    }

    const numero = typeof valor === 'string' ? parseFloat(valor) : valor;

    if (isNaN(numero)) {
      return 'R$ 0,00';
    }

    return numero.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  /**
   * Remove formatação de moeda brasileira e retorna número
   * @param valor - String formatada (R$ 1.234,56) ou número
   * @returns Número limpo
   */
  static limparMoedaBrasileira(valor: string | number | null | undefined): number {
    if (valor === null || valor === undefined || valor === '') {
      return 0;
    }

    // Se já for um número, retorna diretamente
    if (typeof valor === 'number') {
      return isNaN(valor) ? 0 : valor;
    }

    // Se for string, remove formatação
    const numeroLimpo = valor
      .replace(/R\$\s?/g, '')
      .replace(/\./g, '')
      .replace(/,/g, '.')
      .trim();

    const numero = parseFloat(numeroLimpo);
    return isNaN(numero) ? 0 : numero;
  }

  /**
   * Aplica máscara de moeda brasileira progressivamente durante a digitação
   * @param valor - String com apenas números (sem formatação)
   * @returns String formatada progressivamente (R$ 0,00)
   */
  static aplicarMascaraMoedaBrasileira(valor: string): string {
    if (!valor) {
      return 'R$ 0,00';
    }

    // Remove tudo que não é dígito
    const apenasDigitos = valor.replace(/\D/g, '');

    if (!apenasDigitos || apenasDigitos === '0') {
      return 'R$ 0,00';
    }

    // Converte para número (centavos)
    const numero = parseInt(apenasDigitos, 10) / 100;

    // Formata usando locale brasileiro
    return numero.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  static formatCnpj(cnpj: string): string {
    if (!cnpj) {
      return '';
    }
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
  }

  static applyCnpjMask(digits: string): string {
    if (!digits) {
      return '';
    }
    const parts = [] as string[];
    parts.push(digits.slice(0, 2));
    if (digits.length > 2) {
      parts.push(digits.slice(2, 5));
    }
    if (digits.length > 5) {
      parts.push(digits.slice(5, 8));
    }
    if (digits.length > 8) {
      parts.push(digits.slice(8, 12));
    }
    if (digits.length > 12) {
      parts.push(digits.slice(12, 14));
    }

    let out = '';
    if (parts[0]) {
      out += parts[0];
    }
    if (parts[1]) {
      out += `.${parts[1]}`;
    }
    if (parts[2]) {
      out += `.${parts[2]}`;
    }
    if (parts[3]) {
      out += `/${parts[3]}`;
    }
    if (parts[4]) {
      out += `-${parts[4]}`;
    }
    return out;
  }

  /**
   * Formata data progressivamente durante a digitação (DD/MM/YYYY)
   * @param data - String com apenas números (sem formatação)
   * @returns String formatada progressivamente (ex: "12" -> "12", "1234" -> "12/34", "12345678" -> "12/34/5678")
   */
  static formatarDataProgressivo(data: string): string {
    if (!data) {
      return '';
    }

    // Remove tudo que não é número
    const apenasNumeros = data.replace(/\D/g, '');

    // Limita a 8 dígitos (DDMMYYYY)
    const limitado = apenasNumeros.substring(0, 8);

    // Aplica máscara progressiva
    let formatado = limitado;
    if (limitado.length > 2) {
      formatado = `${limitado.substring(0, 2)}/${limitado.substring(2)}`;
    }
    if (limitado.length > 4) {
      formatado = `${limitado.substring(0, 2)}/${limitado.substring(2, 4)}/${limitado.substring(4)}`;
    }

    return formatado;
  }

  /**
   * Remove formatação de data (retorna apenas números)
   */
  static limparData(data: string | null | undefined): string {
    if (!data) {
      return '';
    }
    return data.replace(/\D/g, '');
  }

  /**
   * Valida se a string representa uma data válida no formato DD/MM/YYYY
   * Valida:
   * - Formato DD/MM/AAAA (10 caracteres)
   * - Dia entre 01 e 31 (conforme o mês)
   * - Mês entre 01 e 12
   * - Ano entre 1900 e 2100
   * - Data válida no calendário (ex: 31/02/2024 é inválido)
   */
  static validarData(data: string): boolean {
    // Verificar formato básico
    if (data?.length !== 10) {
      return false;
    }

    // Verificar se está no formato DD/MM/AAAA usando regex
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = data.match(regex);

    if (!match) {
      return false;
    }

    const dia = parseInt(match[1], 10);
    const mes = parseInt(match[2], 10);
    const ano = parseInt(match[3], 10);

    // Validar intervalo do ano (1900 a 2100)
    if (ano < 1900 || ano > 2100) {
      return false;
    }

    // Validar mês
    if (mes < 1 || mes > 12) {
      return false;
    }

    // Validar dia conforme o mês/ano (considera anos bissextos)
    const diasNoMes = new Date(ano, mes, 0).getDate();
    if (dia < 1 || dia > diasNoMes) {
      return false;
    }

    // Verificar se a data construída é válida
    const dataObj = new Date(ano, mes - 1, dia);
    return (
      dataObj.getFullYear() === ano && dataObj.getMonth() === mes - 1 && dataObj.getDate() === dia
    );
  }

  /**
   * Converte string no formato DD/MM/YYYY para objeto Date
   */
  static converterStringParaDate(data: string): Date | null {
    if (!this.validarData(data)) {
      return null;
    }

    const partes = data.split('/');
    const dia = parseInt(partes[0], 10);
    const mes = parseInt(partes[1], 10) - 1; // Mês em JavaScript é 0-indexed
    const ano = parseInt(partes[2], 10);

    return new Date(ano, mes, dia);
  }

  /**
   * Formata número decimal com quantidade específica de casas decimais
   * @param valor - Valor numérico ou string
   * @param casasDecimais - Quantidade de casas decimais (padrão: 2)
   * @returns String formatada no padrão brasileiro (ex: "4,62")
   */
  static formatarDecimal(
    valor: number | string | null | undefined,
    casasDecimais: number = 2,
  ): string {
    if (valor === null || valor === undefined || valor === '') {
      return '';
    }

    const numero = typeof valor === 'string' ? parseFloat(valor) : valor;

    if (isNaN(numero)) {
      return '';
    }

    return numero.toLocaleString('pt-BR', {
      minimumFractionDigits: casasDecimais,
      maximumFractionDigits: casasDecimais,
    });
  }

  /**
   * Formata data/hora no formato brasileiro (DD/MM/YYYY HH:mm)
   * @param data - Date, string ISO ou null/undefined
   * @returns String formatada (DD/MM/YYYY HH:mm) ou string vazia se inválida
   */
  static formatarDataHora(data: Date | string | null | undefined): string {
    if (!data) {
      return '';
    }

    const date = typeof data === 'string' ? new Date(data) : data;

    if (isNaN(date.getTime())) {
      return '';
    }

    const dataFormatada = date.toLocaleDateString('pt-BR');
    const horaFormatada = date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });

    return `${dataFormatada} ${horaFormatada}`;
  }

  /**
   * Formata apenas a data no formato brasileiro (DD/MM/YYYY)
   * @param data - Date, string ISO ou null/undefined
   * @returns String formatada (DD/MM/YYYY) ou string vazia se inválida
   */
  static formatarData(data: Date | string | null | undefined): string {
    if (!data) {
      return '';
    }

    const date = typeof data === 'string' ? new Date(data) : data;

    if (isNaN(date.getTime())) {
      return '';
    }

    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  /**
   * Formata apenas a hora no formato brasileiro (HH:mm)
   * @param data - Date, string ISO ou null/undefined
   * @returns String formatada (HH:mm) ou string vazia se inválida
   */
  static formatarHora(data: Date | string | null | undefined): string {
    if (!data) {
      return '';
    }

    const date = typeof data === 'string' ? new Date(data) : data;

    if (isNaN(date.getTime())) {
      return '';
    }

    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
