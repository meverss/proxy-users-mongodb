import PDFDocument from 'pdfkit-table'

const buildPDF = (dataCallback, endCallback) => {
  const doc = new PDFDocument()

  doc.on('data', dataCallback)
  doc.on('end', endCallback)

  doc.fontSize(30).text('Hello World')
  doc.end()
}

export const exportPDF = (req, res) =>{
  const stream = res.writeHead(200, {
    "Content-Type": "application/pdf",
    "Content-Disposition": "attachment; filename=lista_de_usuarios.pdf",
  })

  buildPDF(
    (data) => stream.write(data),
    () => stream.end()
  )
}