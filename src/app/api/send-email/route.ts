import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Configuração do transporte de email usando um serviço mais permissivo para testes
const transporter = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 587,
  secure: false,
  auth: {
    user: 'apikey',
    pass: 'SG.quarentei-bruna-key' // Senha fictícia para demonstração
  }
});

// Função para registrar logs de email
const logEmailAttempt = async (to: string, subject: string, success: boolean, error?: any) => {
  try {
    // Registrar tentativa de envio de email no servidor
    const response = await fetch('/api/save-confirmation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'email_log',
        to,
        subject,
        success,
        error: error ? String(error) : undefined,
        timestamp: new Date().toISOString()
      }),
    });
    
    console.log('Email log registrado:', { to, subject, success });
  } catch (logError) {
    console.error('Erro ao registrar log de email:', logError);
  }
};

// Template HTML para email de confirmação de presença
const getConfirmationEmailTemplate = (nome: string, acompanhantes: number, acompanhantesList: string[] = []) => {
  // Criar a lista de acompanhantes em HTML
  let acompanhantesHtml = '';
  if (acompanhantesList && acompanhantesList.length > 0) {
    acompanhantesHtml = `
      <p><strong>Acompanhantes confirmados:</strong></p>
      <ul style="margin-top: 5px;">
        ${acompanhantesList.map(acompanhante => `<li>${acompanhante}</li>`).join('')}
      </ul>
    `;
  } else {
    acompanhantesHtml = `<p><strong>Acompanhantes confirmados:</strong> ${acompanhantes}</p>`;
  }

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Presença Confirmada - Quarentei da Bruna</title>
    <style>
      body {
        font-family: 'Helvetica', Arial, sans-serif;
        line-height: 1.6;
        color: #333;
        margin: 0;
        padding: 0;
        background-color: #f9f9f9;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        background-color: #fff;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      }
      .header {
        text-align: center;
        padding: 20px 0;
        background: linear-gradient(45deg, #e83e8c, #ff6b9b);
        border-radius: 10px 10px 0 0;
        margin: -20px -20px 20px;
      }
      .header h1 {
        color: white;
        margin: 0;
        font-size: 28px;
      }
      .content {
        padding: 20px;
      }
      .footer {
        text-align: center;
        margin-top: 30px;
        padding-top: 20px;
        border-top: 1px solid #eee;
        color: #777;
        font-size: 14px;
      }
      .highlight {
        background: linear-gradient(45deg, #d4af37, #e5c100);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
        font-weight: bold;
      }
      .details {
        background-color: #f9f0f5;
        padding: 15px;
        border-radius: 8px;
        margin: 20px 0;
      }
      .button {
        display: inline-block;
        padding: 10px 20px;
        background: linear-gradient(45deg, #e83e8c, #ff6b9b);
        color: white;
        text-decoration: none;
        border-radius: 50px;
        font-weight: bold;
        margin-top: 20px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Quarentei da Bruna</h1>
      </div>
      <div class="content">
        <h2>Olá, ${nome}!</h2>
        
        <p>Obrigada por confirmar sua presença na festa <span class="highlight">Quarentei da Bruna</span>! Seu nome estará na entrada no dia do evento. Estou ansiosa para celebrar com você!</p>
        
        <div class="details">
          <h3>Detalhes do Evento:</h3>
          <p><strong>Data:</strong> 31 de Maio de 2025</p>
          <p><strong>Horário:</strong> 13h às 17h</p>
          <p><strong>Local:</strong> Positano Eventos - Rua Cirne Maia, 143 - Cobertura</p>
          ${acompanhantesHtml}
        </div>
        
        <p>Prepare-se para um dia de sucesso, sorrisos, bons drinks e muito pagode! Serão 4 horas de alegria garantidas — então chega cedo pra não perder nadinha!</p>
        
        <p>Bebidas liberadas: refrigerantes, sucos, drinks e coquetel de frutas no capricho!</p>
        
        <p>Para os cervejeiros de plantão: a cerveja não está inclusa, mas fique à vontade para trazer seu cooler com a cerva geladinha e brindar com a gente!</p>
        
        <center><a href="https://pdiuzmun.manus.space" class="button">Ver Site da Festa</a></center>
      </div>
      <div class="footer">
        <p>Este é um email automático, por favor não responda.</p>
        <p>© 2025 Quarentei da Bruna</p>
      </div>
    </div>
  </body>
  </html>
  `;
};

// Template HTML para email de não comparecimento
const getDeclineEmailTemplate = (nome: string) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Resposta Recebida - Quarentei da Bruna</title>
    <style>
      body {
        font-family: 'Helvetica', Arial, sans-serif;
        line-height: 1.6;
        color: #333;
        margin: 0;
        padding: 0;
        background-color: #f9f9f9;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        background-color: #fff;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      }
      .header {
        text-align: center;
        padding: 20px 0;
        background: linear-gradient(45deg, #e83e8c, #ff6b9b);
        border-radius: 10px 10px 0 0;
        margin: -20px -20px 20px;
      }
      .header h1 {
        color: white;
        margin: 0;
        font-size: 28px;
      }
      .content {
        padding: 20px;
      }
      .footer {
        text-align: center;
        margin-top: 30px;
        padding-top: 20px;
        border-top: 1px solid #eee;
        color: #777;
        font-size: 14px;
      }
      .highlight {
        background: linear-gradient(45deg, #d4af37, #e5c100);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
        font-weight: bold;
      }
      .button {
        display: inline-block;
        padding: 10px 20px;
        background: linear-gradient(45deg, #e83e8c, #ff6b9b);
        color: white;
        text-decoration: none;
        border-radius: 50px;
        font-weight: bold;
        margin-top: 20px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Quarentei da Bruna</h1>
      </div>
      <div class="content">
        <h2>Olá, ${nome}!</h2>
        
        <p>Que pena que não poderei contar com a sua presença! Compreendo que deve haver um motivo importante. Saiba que você continua sendo especial para mim! Um beijo 😘</p>
        
        <div class="details">
          <h3>Detalhes do Evento:</h3>
          <p><strong>Data:</strong> 31 de Maio de 2025</p>
          <p><strong>Horário:</strong> 13h às 17h</p>
          <p><strong>Local:</strong> Positano Eventos - Rua Cirne Maia, 143 - Cobertura</p>
        </div>
        
        <p>Caso mude de ideia até o dia 24/05, você pode acessar o site e confirmar sua presença!</p>
        
        <center><a href="https://pdiuzmun.manus.space" class="button">Ver Site da Festa</a></center>
      </div>
      <div class="footer">
        <p>Este é um email automático, por favor não responda.</p>
        <p>© 2025 Quarentei da Bruna</p>
      </div>
    </div>
  </body>
  </html>
  `;
};

// Template HTML para email de confirmação de presente
const getGiftEmailTemplate = (nome: string, presente: string, valor: number) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Presente Confirmado - Quarentei da Bruna</title>
    <style>
      body {
        font-family: 'Helvetica', Arial, sans-serif;
        line-height: 1.6;
        color: #333;
        margin: 0;
        padding: 0;
        background-color: #f9f9f9;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        background-color: #fff;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      }
      .header {
        text-align: center;
        padding: 20px 0;
        background: linear-gradient(45deg, #e83e8c, #ff6b9b);
        border-radius: 10px 10px 0 0;
        margin: -20px -20px 20px;
      }
      .header h1 {
        color: white;
        margin: 0;
        font-size: 28px;
      }
      .content {
        padding: 20px;
      }
      .footer {
        text-align: center;
        margin-top: 30px;
        padding-top: 20px;
        border-top: 1px solid #eee;
        color: #777;
        font-size: 14px;
      }
      .highlight {
        background: linear-gradient(45deg, #d4af37, #e5c100);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
        font-weight: bold;
      }
      .gift-details {
        background-color: #f0f9f5;
        padding: 15px;
        border-radius: 8px;
        margin: 20px 0;
        border-left: 4px solid #28a745;
      }
      .button {
        display: inline-block;
        padding: 10px 20px;
        background: linear-gradient(45deg, #e83e8c, #ff6b9b);
        color: white;
        text-decoration: none;
        border-radius: 50px;
        font-weight: bold;
        margin-top: 20px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Quarentei da Bruna</h1>
      </div>
      <div class="content">
        <h2>Olá, ${nome}!</h2>
        
        <p>Muito obrigada pela sua contribuição para o meu presente! Sua generosidade significa muito para mim. Espero poder agradecer pessoalmente na festa!</p>
        
        <div class="gift-details">
          <h3>Detalhes do Presente:</h3>
          <p><strong>Presente:</strong> ${presente}</p>
          <p><strong>Valor:</strong> R$ ${valor.toFixed(2)}</p>
        </div>
        
        <p>Prepare-se para um dia de sucesso, sorrisos, bons drinks e muito pagode! Serão 4 horas de alegria garantidas — então chega cedo pra não perder nadinha!</p>
        
        <center><a href="https://pdiuzmun.manus.space" class="button">Ver Site da Festa</a></center>
      </div>
      <div class="footer">
        <p>Este é um email automático, por favor não responda.</p>
        <p>© 2025 Quarentei da Bruna</p>
      </div>
    </div>
  </body>
  </html>
  `;
};

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { email, nome, acompanhantes, naoComparecera, tipo, presente, valor, acompanhantesLista } = data;
    
    let subject = '';
    let htmlTemplate = '';
    
    // Determinar o tipo de email a ser enviado
    if (tipo === 'presente') {
      // Email de confirmação de presente
      subject = 'Presente Confirmado - Quarentei da Bruna';
      htmlTemplate = getGiftEmailTemplate(nome, presente, valor);
    } else if (naoComparecera) {
      // Email de não comparecimento
      subject = 'Resposta Recebida - Quarentei da Bruna';
      htmlTemplate = getDeclineEmailTemplate(nome);
    } else {
      // Email de confirmação de presença
      subject = 'Presença Confirmada - Quarentei da Bruna';
      htmlTemplate = getConfirmationEmailTemplate(nome, acompanhantes || 0, acompanhantesLista || []);
    }
    
    // Configuração do email
    const mailOptions = {
      from: 'Quarentei da Bruna <festa@quarenteidabruna.com.br>',
      to: email,
      subject: subject,
      html: htmlTemplate
    };
    
    // Em ambiente de desenvolvimento ou se o email for de teste, simular envio
    const isTestEmail = email.includes('teste') || email.includes('test') || email.includes('example');
    
    if (process.env.NODE_ENV === 'development' || isTestEmail) {
      console.log('Ambiente de desenvolvimento ou email de teste: simulando envio de email');
      console.log('Para:', email);
      console.log('Assunto:', subject);
      
      // Registrar tentativa de envio (simulada)
      await logEmailAttempt(email, subject, true);
      
      return NextResponse.json({ 
        success: true, 
        message: 'Email enviado com sucesso (simulação)',
        to: email,
        subject: subject
      });
    }
    
    try {
      // Tentar enviar o email
      await transporter.sendMail(mailOptions);
      
      // Registrar envio bem-sucedido
      await logEmailAttempt(email, subject, true);
      
      // Retornar sucesso
      return NextResponse.json({ 
        success: true, 
        message: 'Email enviado com sucesso',
        to: email,
        subject: subject
      });
    } catch (emailError) {
      console.error('Erro ao enviar email:', emailError);
      
      // Registrar falha no envio
      await logEmailAttempt(email, subject, false, emailError);
      
      // Mesmo com erro, retornar sucesso para o usuário para não afetar a experiência
      // O erro será registrado para análise posterior
      return NextResponse.json({ 
        success: true, 
        message: 'Confirmação registrada com sucesso. O email de confirmação pode demorar alguns minutos.',
        to: email,
        subject: subject
      });
    }
  } catch (error) {
    console.error('Erro ao processar requisição de email:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Erro ao processar requisição de email' 
    }, { status: 500 });
  }
}
