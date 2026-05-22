import jsPDF from 'jspdf'

interface TranscriptionSegment {
  text: string
  timestamp: number
  speaker?: string
}

export function exportTranscriptionToPDF(
  transcription: TranscriptionSegment[],
  extractedTasks: any[],
  meetingDate: Date
) {
  const doc = new jsPDF()
  
  // Title
  doc.setFontSize(20)
  doc.setTextColor(59, 130, 246)
  doc.text('MeetingVoice - Transcripción de Reunión', 20, 20)
  
  // Date
  doc.setFontSize(12)
  doc.setTextColor(100, 100, 100)
  doc.text(`Fecha: ${meetingDate.toLocaleDateString('es-ES', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })}`, 20, 30)
  
  doc.text(`Hora: ${meetingDate.toLocaleTimeString('es-ES')}`, 20, 38)
  
  // Transcription section
  doc.setFontSize(16)
  doc.setTextColor(0, 0, 0)
  doc.text('Transcripción', 20, 55)
  
  let yPosition = 65
  doc.setFontSize(10)
  
  transcription.forEach((segment, index) => {
    if (yPosition > 270) {
      doc.addPage()
      yPosition = 20
    }
    
    doc.setTextColor(59, 130, 246)
    doc.text(`${segment.speaker || 'Voz ' + (index + 1)} - ${new Date(segment.timestamp).toLocaleTimeString()}`, 20, yPosition)
    yPosition += 7
    
    doc.setTextColor(0, 0, 0)
    const lines = doc.splitTextToSize(segment.text, 170)
    doc.text(lines, 20, yPosition)
    yPosition += lines.length * 5 + 5
  })
  
  // Tasks section
  if (extractedTasks.length > 0) {
    doc.addPage()
    yPosition = 20
    
    doc.setFontSize(16)
    doc.setTextColor(0, 0, 0)
    doc.text('Tareas Extraídas', 20, yPosition)
    yPosition += 15
    
    doc.setFontSize(10)
    
    extractedTasks.forEach((task, index) => {
      if (yPosition > 250) {
        doc.addPage()
        yPosition = 20
      }
      
      doc.setTextColor(59, 130, 246)
      doc.text(`Tarea ${index + 1}:`, 20, yPosition)
      yPosition += 7
      
      doc.setTextColor(0, 0, 0)
      doc.text(`Descripción: ${task.description}`, 25, yPosition)
      yPosition += 5
      
      if (task.responsible) {
        doc.text(`Responsable: ${task.responsible}`, 25, yPosition)
        yPosition += 5
      }
      
      if (task.deadline) {
        doc.text(`Fecha límite: ${new Date(task.deadline).toLocaleDateString('es-ES')}`, 25, yPosition)
        yPosition += 5
      }
      
      if (task.project) {
        doc.text(`Proyecto: ${task.project}`, 25, yPosition)
        yPosition += 5
      }
      
      yPosition += 5
    })
  }
  
  // Footer
  const pageCount = doc.internal.pages.length - 1
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(150, 150, 150)
    doc.text(
      `Página ${i} de ${pageCount} - Generado por MeetingVoice`,
      20,
      285
    )
  }
  
  // Save
  const fileName = `transcripcion_${meetingDate.getTime()}.pdf`
  doc.save(fileName)
}
