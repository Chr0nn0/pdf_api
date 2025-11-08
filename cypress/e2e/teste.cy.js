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