it('Upload De Imagens', () => {
    cy.readFile('cypress/fixtures/imagem01.jpg','binary').then((file) =>{
        cy.window().then((win) => {
            const blob = Cypress.Blob.binaryStringToBlob(file, 'image/jpg')
            const formData = new win.FormData();
            formData.append('files', blob, 'imagem01.jpg')
            formData.append('file_name', Cypress.env('file_name'))
            cy.request({
                method: 'Post',
                url: Cypress.env('url'),
                body: formData,
                headers: {'Content-Type': 'multipart/form-data', 
                    'email':Cypress.env('email')}
            }).then((resp) => {
                expect(resp.status).to.eq(200)
            })
        })
    })
})
it('valida o email na resposta da API', () =>{
    cy.visit(Cypress.env('yopmail'));
    cy.get('body').then(($body) => {
        const $btn = $body.find('[aria-label="Consent"]');
       if ($btn.length && $btn.is(':visible')) {
        cy.wrap($btn).click({ force: true });
      }
    });
    cy.get('[class="ycptinput"]').type(Cypress.env('email'))
    cy.get('[id="refreshbut"]').click();
    cy.get('iframe#ifmail', { timeout: 15000 }).should('exist').then(($iframe) => {
      const body = $iframe.contents().find('body');
      cy.wrap(body)
        .find('a[title*="'+Cypress.env('file_name')+'"]', { timeout: 10000 })
        .should('be.visible');
    });
  });
  after(() => {
    // ✅ roda uma única vez após TODOS os testes desta suíte
    cy.log('Depois de todos os testes');
    cy.get('div[class="wminboxheader"] > div > button[class="md but textu f24"]:not([id="delsel"])').click();
    cy.get('[id="delall"]').click();
    cy.on('window:confirm' , () => {
      return true
    })
    cy.contains('Are you sure').click();
    cy.get('[id="message"]')
      .should('be.visible');
    });

    // Exemplo: limpar dados, fechar sessão, deletar fixtures, etc.