import { AbstractControl, ValidationErrors, ValidatorFn, FormGroup } from '@angular/forms';

/**
 * Classe utilitária estática para validadores customizados
 */
export class ValidatorUtil {
  /**
   * Validador de CPF
   * Verifica se o CPF é válido segundo o algoritmo oficial
   */
  static cpfValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const cpf = control.value?.toString().replace(/\D/g, '');

      if (!cpf || cpf.length === 0) {
        return null; // Deixa o Validators.required cuidar disso
      }

      if (cpf.length !== 11) {
        return { cpfInvalido: true };
      }

      // Verifica se todos os dígitos são iguais
      if (/^(\d)\1+$/.test(cpf)) {
        return { cpfInvalido: true };
      }

      // Validação do primeiro dígito verificador
      let soma = 0;
      for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (10 - i);
      }
      let resto = (soma * 10) % 11;
      if (resto === 10 || resto === 11) {
        resto = 0;
      }
      if (resto !== parseInt(cpf.charAt(9))) {
        return { cpfInvalido: true };
      }

      // Validação do segundo dígito verificador
      soma = 0;
      for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * (11 - i);
      }
      resto = (soma * 10) % 11;
      if (resto === 10 || resto === 11) {
        resto = 0;
      }
      if (resto !== parseInt(cpf.charAt(10))) {
        return { cpfInvalido: true };
      }

      return null;
    };
  }

  /**
   * Verifica se um CNPJ é válido segundo o algoritmo oficial.
   * Aceita CNPJ com ou sem formatação.
   * @param cnpj CNPJ a ser validado
   * @returns true se o CNPJ é válido, false caso contrário
   */
  static isValidCnpj(cnpj: string | null | undefined): boolean {
    const cnpjLimpo = cnpj?.toString().replace(/\D/g, '') ?? '';

    if (!cnpjLimpo || cnpjLimpo.length === 0) {
      return false;
    }

    if (cnpjLimpo.length !== 14) {
      return false;
    }

    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1+$/.test(cnpjLimpo)) {
      return false;
    }

    // Validação do primeiro dígito verificador
    let tamanho = cnpjLimpo.length - 2;
    let numeros = cnpjLimpo.substring(0, tamanho);
    const digitos = cnpjLimpo.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
      soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
      if (pos < 2) {
        pos = 9;
      }
    }

    let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado !== parseInt(digitos.charAt(0))) {
      return false;
    }

    // Validação do segundo dígito verificador
    tamanho = tamanho + 1;
    numeros = cnpjLimpo.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
      soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
      if (pos < 2) {
        pos = 9;
      }
    }

    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    return resultado === parseInt(digitos.charAt(1));
  }

  /**
   * Validador de CNPJ
   * Verifica se o CNPJ é válido segundo o algoritmo oficial
   */
  static cnpjValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const cnpj = control.value?.toString().replace(/\D/g, '');

      if (!cnpj || cnpj.length === 0) {
        return null; // Deixa o Validators.required cuidar disso
      }

      return ValidatorUtil.isValidCnpj(cnpj) ? null : { cnpjInvalido: true };
    };
  }

  /**
   * Validador combinado de CPF/CNPJ baseado no tipo de pessoa
   * Valida CPF se tipo = 1 (Pessoa Física) ou CNPJ se tipo = 2 (Pessoa Jurídica)
   * @param tipoControl FormControl que contém o tipo de pessoa (1 ou 2)
   * @returns ValidatorFn que valida CPF ou CNPJ conforme o tipo
   */
  static cpfCnpjValidator(tipoControl: AbstractControl): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const tipo = tipoControl.value;
      const documento = control.value?.toString().replace(/\D/g, '');

      if (!documento || documento.length === 0) {
        return null; // Deixa o Validators.required cuidar disso
      }

      // Tipo 1 = Pessoa Física (CPF)
      if (tipo === 1) {
        if (documento.length !== 11) {
          return { cpfInvalido: true };
        }

        // Verifica se todos os dígitos são iguais
        if (/^(\d)\1+$/.test(documento)) {
          return { cpfInvalido: true };
        }

        // Validação do primeiro dígito verificador
        let soma = 0;
        for (let i = 0; i < 9; i++) {
          soma += parseInt(documento.charAt(i)) * (10 - i);
        }
        let resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) {
          resto = 0;
        }
        if (resto !== parseInt(documento.charAt(9))) {
          return { cpfInvalido: true };
        }

        // Validação do segundo dígito verificador
        soma = 0;
        for (let i = 0; i < 10; i++) {
          soma += parseInt(documento.charAt(i)) * (11 - i);
        }
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) {
          resto = 0;
        }
        if (resto !== parseInt(documento.charAt(10))) {
          return { cpfInvalido: true };
        }

        return null;
      }

      // Tipo 2 = Pessoa Jurídica (CNPJ)
      if (tipo === 2) {
        if (documento.length !== 14) {
          return { cnpjInvalido: true };
        }

        // Verifica se todos os dígitos são iguais
        if (/^(\d)\1+$/.test(documento)) {
          return { cnpjInvalido: true };
        }

        // Validação do primeiro dígito verificador
        let tamanho = documento.length - 2;
        let numeros = documento.substring(0, tamanho);
        const digitos = documento.substring(tamanho);
        let soma = 0;
        let pos = tamanho - 7;

        for (let i = tamanho; i >= 1; i--) {
          soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
          if (pos < 2) {
            pos = 9;
          }
        }

        let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
        if (resultado !== parseInt(digitos.charAt(0))) {
          return { cnpjInvalido: true };
        }

        // Validação do segundo dígito verificador
        tamanho = tamanho + 1;
        numeros = documento.substring(0, tamanho);
        soma = 0;
        pos = tamanho - 7;

        for (let i = tamanho; i >= 1; i--) {
          soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
          if (pos < 2) {
            pos = 9;
          }
        }

        resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
        if (resultado !== parseInt(digitos.charAt(1))) {
          return { cnpjInvalido: true };
        }

        return null;
      }

      // Se o tipo não for 1 nem 2, não valida
      return null;
    };
  }

  /**
   * Validador de telefone
   * Aceita formatos: (XX) XXXX-XXXX ou (XX) XXXXX-XXXX
   */
  static telefoneValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null;
      }

      const telefone = value.toString().replace(/\D/g, '');

      // 1. Valida se tem 10 ou 11 dígitos
      if (telefone.length < 10 || telefone.length > 11) {
        return { telefoneInvalido: true };
      }

      // 2. Valida se não é uma sequência de números repetidos
      if (/^(\d)\1+$/.test(telefone)) {
        return { telefoneInvalido: true };
      }

      // 3. Valida DDD (11 a 99)
      const ddd = parseInt(telefone.substring(0, 2), 10);
      if (ddd < 11 || ddd > 99) {
        return { telefoneInvalido: true };
      }

      // 4. Validação específica para celulares (11 dígitos)
      if (telefone.length === 11) {
        // O primeiro dígito após o DDD deve ser '9' para celulares
        if (telefone.charAt(2) !== '9') {
          return { telefoneInvalido: true };
        }
      }

      return null;
    };
  }

  /**
   * Validador para garantir que o campo não contém apenas espaços em branco
   */
  static noWhitespaceValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const isWhitespace = (control.value || '').trim().length === 0;
      return isWhitespace && control.value?.length > 0 ? { whitespace: true } : null;
    };
  }

  /**
   * Verifica se um CPF já existe em um array de controles de formulário
   * @param cpf CPF a ser verificado (pode conter formatação)
   * @param controls Array de AbstractControl para verificar
   * @param cpfFieldName Nome do campo CPF no FormGroup (padrão: 'cpf')
   * @param excludeIndex Índice opcional a ser excluído da verificação (útil na edição)
   * @returns true se o CPF já existe, false caso contrário
   */
  static cpfDuplicadoEmArray(
    cpf: string | null | undefined,
    controls: AbstractControl[],
    cpfFieldName: string = 'cpf',
    excludeIndex?: number,
  ): boolean {
    if (!cpf) {
      return false;
    }

    const cpfLimpo = cpf.replace(/\D/g, '');
    if (cpfLimpo.length !== 11) {
      return false;
    }

    return controls.some((control, index) => {
      // Ignora o índice especificado (útil para edição)
      if (excludeIndex !== undefined && index === excludeIndex) {
        return false;
      }

      const cpfControl = control.get(cpfFieldName)?.value;
      if (!cpfControl) {
        return false;
      }

      const cpfControlLimpo = cpfControl.toString().replace(/\D/g, '');
      return cpfControlLimpo === cpfLimpo;
    });
  }

  /**
   * Verifica se um CNPJ já existe em um array de controles de formulário
   * @param cnpj CNPJ a ser verificado (pode conter formatação)
   * @param controls Array de AbstractControl para verificar
   * @param cnpjFieldName Nome do campo CNPJ no FormGroup (padrão: 'cnpj')
   * @param excludeIndex Índice opcional a ser excluído da verificação (útil na edição)
   * @returns true se o CNPJ já existe, false caso contrário
   */
  static cnpjDuplicadoEmArray(
    cnpj: string | null | undefined,
    controls: AbstractControl[],
    cnpjFieldName: string = 'cnpj',
    excludeIndex?: number,
  ): boolean {
    if (!cnpj) {
      return false;
    }

    const cnpjLimpo = cnpj.replace(/\D/g, '');
    if (cnpjLimpo.length !== 14) {
      return false;
    }

    return controls.some((control, index) => {
      // Ignora o índice especificado (útil para edição)
      if (excludeIndex !== undefined && index === excludeIndex) {
        return false;
      }

      const cnpjControl = control.get(cnpjFieldName)?.value;
      if (!cnpjControl) {
        return false;
      }

      const cnpjControlLimpo = cnpjControl.toString().replace(/\D/g, '');
      return cnpjControlLimpo === cnpjLimpo;
    });
  }

  /**
   * Verifica se um CPF já existe em um Map de objetos
   * @param cpf CPF a ser verificado (pode conter formatação)
   * @param dataMap Map contendo objetos com propriedade CPF
   * @param cpfFieldName Nome do campo CPF no objeto (padrão: 'cpf')
   * @returns true se o CPF já existe, false caso contrário
   */
  static cpfDuplicadoEmMap<T extends Record<string, any>>(
    cpf: string | null | undefined,
    dataMap: Map<string, T>,
    cpfFieldName: string = 'cpf',
  ): boolean {
    if (!cpf) {
      return false;
    }

    const cpfLimpo = cpf.replace(/\D/g, '');
    if (cpfLimpo.length !== 11) {
      return false;
    }

    return Array.from(dataMap.values()).some((item) => {
      const itemCpf = item[cpfFieldName];
      if (!itemCpf) {
        return false;
      }

      const itemCpfLimpo = itemCpf.toString().replace(/\D/g, '');
      return itemCpfLimpo === cpfLimpo;
    });
  }

  /**
   * Validador para verificar se uma data não está vencida (não é anterior a hoje)
   * @returns ValidatorFn que verifica se a data é futura ou igual a hoje
   */
  static dataFuturaOuHoje(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null; // Deixa o Validators.required cuidar disso
      }

      const dataInformada = new Date(value);
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0); // Zerar horas para comparar apenas a data

      if (dataInformada < hoje) {
        return { dataVencida: true };
      }

      return null;
    };
  }

  /**
   * Validador condicional: se o campo CNH está preenchido, exige vencimento
   * @param cnhControlName Nome do campo CNH
   * @param vencimentoControlName Nome do campo de vencimento
   * @returns ValidatorFn que valida a regra
   */
  static cnhExigeVencimento(cnhControlName: string, vencimentoControlName: string): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const formGroup = group as FormGroup;
      const cnhControl = formGroup.get(cnhControlName);
      const vencimentoControl = formGroup.get(vencimentoControlName);

      if (!cnhControl || !vencimentoControl) {
        return null;
      }

      const cnhValue = cnhControl.value?.trim();
      const vencimentoValue = vencimentoControl.value;

      // Se CNH está preenchida mas vencimento não está
      if (cnhValue && !vencimentoValue) {
        vencimentoControl.setErrors({ vencimentoCnhObrigatorio: true });
        return { vencimentoCnhObrigatorio: true };
      }

      // Se estava com erro mas agora tem vencimento, remover o erro
      if (vencimentoControl.hasError('vencimentoCnhObrigatorio') && vencimentoValue) {
        const errors = vencimentoControl.errors;
        if (errors) {
          delete errors['vencimentoCnhObrigatorio'];
          vencimentoControl.setErrors(Object.keys(errors).length > 0 ? errors : null);
        }
      }

      return null;
    };
  }

  /**
   * Validador condicional: se agente funerário está marcado, valida que CNH não está vencida
   * @param agenteFunerarioControlName Nome do campo de agente funerário (boolean)
   * @param vencimentoControlName Nome do campo de vencimento da CNH
   * @returns ValidatorFn que valida a regra
   */
  static cnhNaoVencida(
    agenteFunerarioControlName: string,
    vencimentoControlName: string,
  ): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const formGroup = group as FormGroup;
      const agenteFunerarioControl = formGroup.get(agenteFunerarioControlName);
      const vencimentoControl = formGroup.get(vencimentoControlName);

      if (!agenteFunerarioControl || !vencimentoControl) {
        return null;
      }

      const isAgenteFunerario = agenteFunerarioControl.value === true;
      const vencimentoValue = vencimentoControl.value;

      // Se não é agente funerário, não valida
      if (!isAgenteFunerario) {
        // Remove o erro se estava setado
        if (vencimentoControl.hasError('cnhVencida')) {
          const errors = vencimentoControl.errors;
          if (errors) {
            delete errors['cnhVencida'];
            vencimentoControl.setErrors(Object.keys(errors).length > 0 ? errors : null);
          }
        }
        return null;
      }

      // Se é agente funerário mas não tem vencimento, deixa o cnhExigeVencimento cuidar
      if (!vencimentoValue) {
        return null;
      }

      // Valida se a data de vencimento não está vencida (deve ser futura)
      const dataVencimento = new Date(vencimentoValue);
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0); // Zerar horas para comparar apenas a data

      if (dataVencimento < hoje) {
        vencimentoControl.setErrors({ cnhVencida: true });
        return { cnhVencida: true };
      }

      // Se estava com erro mas agora a data é válida, remover o erro
      if (vencimentoControl.hasError('cnhVencida')) {
        const errors = vencimentoControl.errors;
        if (errors) {
          delete errors['cnhVencida'];
          vencimentoControl.setErrors(Object.keys(errors).length > 0 ? errors : null);
        }
      }

      return null;
    };
  }

  /**
   * Validador de data no formato ISO (YYYY-MM-DD) usado por inputs type="date"
   * Verifica se a data é válida e realmente existe no calendário
   * @returns ValidatorFn que valida se a data é válida
   */
  static dataValidaISO(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null; // Deixa o Validators.required cuidar disso
      }

      // Verifica formato ISO básico YYYY-MM-DD
      const isoRegex = /^(\d{4})-(\d{2})-(\d{2})$/;
      const match = value.match(isoRegex);

      if (!match) {
        return { dataInvalida: true };
      }

      const ano = parseInt(match[1], 10);
      const mes = parseInt(match[2], 10);
      const dia = parseInt(match[3], 10);

      // Valida ano (1900-2100)
      if (ano < 1900 || ano > 2100) {
        return { dataInvalida: true };
      }

      // Valida mês (1-12)
      if (mes < 1 || mes > 12) {
        return { dataInvalida: true };
      }

      // Valida dia conforme o mês
      const diasPorMes = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

      // Verifica ano bissexto
      const ehBissexto = (ano % 4 === 0 && ano % 100 !== 0) || ano % 400 === 0;
      if (ehBissexto) {
        diasPorMes[1] = 29;
      }

      const maxDias = diasPorMes[mes - 1];
      if (dia < 1 || dia > maxDias) {
        return { dataInvalida: true };
      }

      // Verifica se a data realmente existe (validação extra com objeto Date)
      const dataCompleta = new Date(ano, mes - 1, dia);
      if (
        dataCompleta.getFullYear() !== ano ||
        dataCompleta.getMonth() !== mes - 1 ||
        dataCompleta.getDate() !== dia
      ) {
        return { dataInvalida: true };
      }

      return null;
    };
  }

  /**
   * Valida tamanho máximo de arquivo
   * @param maxSizeMB Tamanho máximo em MB (padrão: 10MB)
   * @returns true se o arquivo é válido, string com erro caso contrário
   */
  static validarTamanhoArquivo(file: File | null, maxSizeMB: number = 10): string | null {
    if (!file) {
      return null;
    }

    const maxBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxBytes) {
      return `O arquivo deve ter no máximo ${maxSizeMB}MB. Tamanho atual: ${(file.size / (1024 * 1024)).toFixed(2)}MB`;
    }

    return null;
  }

  /**
   * Validador para limitar o número de casas decimais em campos numéricos
   * @param maxDecimalPlaces Número máximo de casas decimais permitidas
   * @returns ValidatorFn que verifica se o valor tem no máximo maxDecimalPlaces casas decimais
   */
  static maxDecimalPlaces(maxDecimalPlaces: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (value === null || value === undefined || value === '') {
        return null; // Deixa o Validators.required cuidar disso
      }

      const valueStr = value.toString();

      // Verifica se tem ponto decimal
      if (valueStr.includes('.')) {
        const decimalPart = valueStr.split('.')[1];
        if (decimalPart && decimalPart.length > maxDecimalPlaces) {
          return { maxDecimalPlaces: { max: maxDecimalPlaces, actual: decimalPart.length } };
        }
      }

      return null;
    };
  }

  /**
   * Validador que verifica se a data não é futura
   * Útil para validar datas de nascimento, óbito, etc.
   */
  static dateNotFutureValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (!value) {
        return null; // Deixa o Validators.required cuidar disso
      }

      const inputDate = new Date(value);
      const today = new Date();

      // Zerar as horas para comparar apenas as datas
      today.setHours(0, 0, 0, 0);
      inputDate.setHours(0, 0, 0, 0);

      if (inputDate > today) {
        return { dataFutura: true };
      }

      return null;
    };
  }

  /**
   * Validador que exige que pelo menos um dos campos especificados esteja preenchido
   * Útil para validar contatos onde telefone OU email deve ser preenchido
   * @param fields Array com os nomes dos campos a serem validados (ex: ['telefone', 'email'])
   * @returns ValidatorFn que verifica se pelo menos um campo tem valor
   */
  static atLeastOneContactValidator(fields: string[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!(control instanceof FormGroup)) {
        return null;
      }

      const hasAtLeastOne = fields.some((fieldName) => {
        const field = control.get(fieldName);
        const value = field?.value;

        // Verifica se o campo tem valor não-vazio após trim
        return value && value.toString().trim().length > 0;
      });

      return hasAtLeastOne ? null : { atLeastOneContact: true };
    };
  }

  /**
   * Validador de data no formato DD/MM/AAAA
   * Valida se a data é válida considerando:
   * - Formato correto (DD/MM/AAAA)
   * - Dia válido para o mês (considerando ano bissexto)
   * - Mês válido (01-12)
   * - Ano válido (1900-2100)
   */
  static dataFormatoDDMMAAAAValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (!value || value.toString().trim() === '') {
        return null; // Campo vazio é válido (use Validators.required se obrigatório)
      }

      const dateStr = value.toString().trim();

      // Verifica formato DD/MM/AAAA (com ou sem barras)
      const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
      const match = dateStr.match(regex);

      if (!match) {
        return { dataFormatoInvalido: true };
      }

      const dia = parseInt(match[1], 10);
      const mes = parseInt(match[2], 10);
      const ano = parseInt(match[3], 10);

      // Valida mês (1-12)
      if (mes < 1 || mes > 12) {
        return { dataMesInvalido: true };
      }

      // Valida ano (1900-2100)
      if (ano < 1900 || ano > 2100) {
        return { dataAnoInvalido: true };
      }

      // Valida dia conforme o mês
      const diasPorMes = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

      // Verifica ano bissexto
      const ehBissexto = (ano % 4 === 0 && ano % 100 !== 0) || ano % 400 === 0;
      if (ehBissexto) {
        diasPorMes[1] = 29;
      }

      const maxDias = diasPorMes[mes - 1];
      if (dia < 1 || dia > maxDias) {
        return { dataDiaInvalido: true };
      }

      // Verifica se a data realmente existe (validação extra com objeto Date)
      const dataCompleta = new Date(ano, mes - 1, dia);
      if (
        dataCompleta.getFullYear() !== ano ||
        dataCompleta.getMonth() !== mes - 1 ||
        dataCompleta.getDate() !== dia
      ) {
        return { dataInvalida: true };
      }

      return null;
    };
  }

  /**
   * Validador para strings que devem conter apenas números
   * Aceita valores vazios (use Validators.required se obrigatório)
   */
  static numericStringValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (!value || value.toString().trim() === '') {
        return null; // Campo vazio é válido
      }

      const numericRegex = /^\d+$/;
      if (!numericRegex.test(value.toString().trim())) {
        return { apenasNumeros: true };
      }

      return null;
    };
  }

  /**
   * Validador para garantir que a data fim seja maior que a data início
   * Usado em pares de campos de data (início/fim do contrato, período, etc.)
   * @param dataInicioControlName - Nome do control da data de início
   * @param dataFimControlName - Nome do control da data de fim
   * @returns ValidatorFn que deve ser aplicado no FormGroup
   */
  static dataFimMaiorQueDataInicio(
    dataInicioControlName: string,
    dataFimControlName: string,
  ): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      if (!(group instanceof FormGroup)) {
        return null;
      }

      const dataInicioControl = group.get(dataInicioControlName);
      const dataFimControl = group.get(dataFimControlName);

      if (!dataInicioControl || !dataFimControl) {
        return null;
      }

      const dataInicio = dataInicioControl.value;
      const dataFim = dataFimControl.value;

      // Se alguma das datas estiver vazia, não valida
      if (!dataInicio || !dataFim) {
        return null;
      }

      // Converter para objetos Date para comparação
      const dateInicio = new Date(dataInicio);
      const dateFim = new Date(dataFim);

      // Validar se são datas válidas
      if (isNaN(dateInicio.getTime()) || isNaN(dateFim.getTime())) {
        return null;
      }

      // Verificar se data fim é maior que data início
      if (dateFim <= dateInicio) {
        // Adicionar erro apenas no control de data fim
        dataFimControl.setErrors({
          ...dataFimControl.errors,
          dataFimMenorOuIgualInicio: true,
        });
        return { dataFimMenorOuIgualInicio: true };
      }

      // Remover erro se existir
      if (dataFimControl.hasError('dataFimMenorOuIgualInicio')) {
        const errors = { ...dataFimControl.errors };
        delete errors['dataFimMenorOuIgualInicio'];
        dataFimControl.setErrors(Object.keys(errors).length > 0 ? errors : null);
      }

      return null;
    };
  }

  /**
   * Validador para input type="date" (formato ISO YYYY-MM-DD)
   * Valida se a data está em formato válido e se o ano está no range correto
   * @param minYear - Ano mínimo permitido (padrão: 1900)
   * @param maxYear - Ano máximo permitido (padrão: 2100)
   */
  static dateInputValidator(minYear: number = 1900, maxYear: number = 2100): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (!value || value.toString().trim() === '') {
        return null; // Campo vazio é válido (use Validators.required se obrigatório)
      }

      const dateStr = value.toString().trim();

      // Verifica formato ISO YYYY-MM-DD
      const isoRegex = /^(\d{4})-(\d{2})-(\d{2})$/;
      const match = dateStr.match(isoRegex);

      if (!match) {
        return { dataFormatoInvalido: true };
      }

      const ano = parseInt(match[1], 10);
      const mes = parseInt(match[2], 10);
      const dia = parseInt(match[3], 10);

      // Valida ano (range configurável)
      if (ano < minYear || ano > maxYear) {
        return { dataAnoInvalido: true };
      }

      // Valida mês (1-12)
      if (mes < 1 || mes > 12) {
        return { dataMesInvalido: true };
      }

      // Valida dia conforme o mês
      const diasPorMes = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

      // Verifica ano bissexto
      const ehBissexto = (ano % 4 === 0 && ano % 100 !== 0) || ano % 400 === 0;
      if (ehBissexto) {
        diasPorMes[1] = 29;
      }

      const maxDias = diasPorMes[mes - 1];
      if (dia < 1 || dia > maxDias) {
        return { dataDiaInvalido: true };
      }

      // Verifica se a data realmente existe (validação extra com objeto Date)
      const dataCompleta = new Date(ano, mes - 1, dia);
      if (
        dataCompleta.getFullYear() !== ano ||
        dataCompleta.getMonth() !== mes - 1 ||
        dataCompleta.getDate() !== dia
      ) {
        return { dataInvalida: true };
      }

      return null;
    };
  }

  /**
   * Validador para MatDatepicker
   * Verifica se o valor é um objeto Date válido (não Invalid Date)
   * Use este validador para campos com MatDatepicker para garantir datas válidas
   */
  static dateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (!value) {
        return null; // Campo vazio é válido (use Validators.required se obrigatório)
      }

      // Verifica se é um objeto Date
      if (!(value instanceof Date)) {
        return { dataInvalida: true };
      }

      // Verifica se é uma data válida (não Invalid Date)
      if (isNaN(value.getTime())) {
        return { dataInvalida: true };
      }

      // Valida ano (1900-2100) para evitar anos absurdos
      const ano = value.getFullYear();
      if (ano < 1900 || ano > 2100) {
        return { dataAnoInvalido: true };
      }

      return null;
    };
  }
}
