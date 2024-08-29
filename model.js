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
        this.whatsAppLink    = `https://wa.me/${whatsApp}?text=${message}`;
        this.dataAgendamento = dataAgendamento;
    }

    getMarkerColor() {
        switch (this.status) {
            case 'Pendente Agendamento':
                return 'red';
            case 'Aguardando Visita':
                return 'yellow';
            case 'Visitada':
                return 'green';
            default:
                return 'blue';
        }
    }

    getCoordinates() {
        return [this.latitude, this.longitude];
    }

    getPopupContent() {
        return `
            <b>${this.nome}</b><br>
            <b>Status:</b> ${this.status}<br>
            <b>Diretor:</b> ${this.diretor}<br>
            <a href="${this.whatsAppLink}" target="_blank" class="whatsapp-button">Entrar em contato via WhatsApp</a>
        `;
    }
}