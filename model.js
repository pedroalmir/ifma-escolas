const message = `Prezado(a) diretor(a), em nome do IFMA Campus Pedreiras, gostaríamos de agendar uma visita 
 à sua escola para divulgar nosso processo seletivo. Essa ação faz parte do projeto *IFMA nas Escolas* e nosso 
 público alvo são estudantes do 9º ano. Quando você pode nos receber?`;

class Escola {    
    constructor(nome, latitude, longitude, status, diretor, whatsApp, dataAgendamento) {
        this.nome            = nome;
        this.latitude        = parseFloat(latitude);
        this.longitude       = parseFloat(longitude);
        this.status          = status;
        this.diretor         = diretor;
        this.whatsAppLink    = `https://wa.me/+${whatsApp}?text=${message}`;
        this.dataAgendamento = dataAgendamento;
    }

    getCoordinates() {
        return [this.latitude, this.longitude];
    }

    getPopupContent() {
        var content = `
            <b>${this.nome}</b><br>
            <b>Status:</b> ${this.status}<br>
            <b>Diretor:</b> ${this.diretor}<br>
        `;
        if(this.status === 'Pendente Agendamento'){
            content += '<p style="text-align: center"><a href="${this.whatsAppLink}" target="_blank" class="whatsapp-button" style="color: white;">Agendar via WhatsApp</a></p>'
        }else if(this.status === 'Aguardando Visita'){
            content += `<b>Data da Visita:</b> ${this.dataAgendamento}<br>`
        }

        return content;
    }
}