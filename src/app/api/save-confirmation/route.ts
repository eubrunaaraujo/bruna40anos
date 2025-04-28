import { NextRequest, NextResponse } from 'next/server';
import { Confirmacao, carregarConfirmacoes, salvarConfirmacao, excluirConfirmacao, limparConfirmacoes, gerarDadosAmostra, salvarConfirmacoes } from '@/lib/confirmationStorage';

// Rota para salvar confirmação
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Verificar se é uma solicitação para limpar todos os dados
    if (data.limparTudo) {
      limparConfirmacoes();
      
      // Gerar dados de amostra após limpar
      const dadosAmostra = gerarDadosAmostra();
      
      return NextResponse.json({ 
        success: true, 
        message: 'Todos os dados foram limpos com sucesso.', 
        data: dadosAmostra 
      });
    }
    
    // Verificar se é uma solicitação de sincronização
    if (data.syncData && Array.isArray(data.syncData)) {
      // Carregar dados locais
      const confirmacoesLocais = carregarConfirmacoes();
      
      // Criar um mapa para facilitar a busca por ID
      const confirmacoesMapa = new Map<string, Confirmacao>();
      confirmacoesLocais.forEach(conf => {
        if (conf.id) {
          confirmacoesMapa.set(conf.id, conf);
        }
      });
      
      // Sincronizar dados recebidos com os locais
      for (const confirmacao of data.syncData) {
        if (!confirmacao.id) continue;
        
        // Se a confirmação não existe localmente ou é mais recente, adicionar/atualizar
        if (!confirmacoesMapa.has(confirmacao.id) || 
            new Date(confirmacao.dataConfirmacao) > new Date(confirmacoesMapa.get(confirmacao.id)?.dataConfirmacao || '')) {
          confirmacoesMapa.set(confirmacao.id, confirmacao);
        }
      }
      
      // Converter mapa de volta para array
      const todasConfirmacoes = Array.from(confirmacoesMapa.values());
      
      // Salvar confirmações sincronizadas
      salvarConfirmacoes(todasConfirmacoes);
      
      return NextResponse.json({ 
        success: true, 
        message: 'Dados sincronizados com sucesso.', 
        data: todasConfirmacoes 
      });
    }
    
    // Caso contrário, é uma solicitação para salvar uma única confirmação
    if (!data.id || !data.nome) {
      return NextResponse.json({ 
        success: false, 
        message: 'Dados incompletos. ID e nome são obrigatórios.' 
      }, { status: 400 });
    }
    
    // Salvar confirmação
    salvarConfirmacao(data);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Confirmação salva com sucesso.' 
    });
    
  } catch (error) {
    console.error('Erro ao processar solicitação:', error);
    return NextResponse.json({ 
      success: false, 
      message: `Erro ao processar solicitação: ${error instanceof Error ? error.message : 'Erro desconhecido'}` 
    }, { status: 500 });
  }
}

// Rota para obter todas as confirmações
export async function GET() {
  try {
    // Obter confirmações do localStorage
    const confirmacoes = carregarConfirmacoes();
    
    return NextResponse.json({ 
      success: true, 
      data: confirmacoes 
    });
  } catch (error) {
    console.error('Erro ao obter confirmações:', error);
    return NextResponse.json({ 
      success: false, 
      message: `Erro ao obter confirmações: ${error instanceof Error ? error.message : 'Erro desconhecido'}` 
    }, { status: 500 });
  }
}

// Rota para excluir uma confirmação
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ 
        success: false, 
        message: 'ID não fornecido.' 
      }, { status: 400 });
    }
    
    // Excluir confirmação
    excluirConfirmacao(id);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Confirmação excluída com sucesso.' 
    });
  } catch (error) {
    console.error('Erro ao excluir confirmação:', error);
    return NextResponse.json({ 
      success: false, 
      message: `Erro ao excluir confirmação: ${error instanceof Error ? error.message : 'Erro desconhecido'}` 
    }, { status: 500 });
  }
}
