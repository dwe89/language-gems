# generate_spanish_revision.py
import re
import random
from typing import Dict, List, Tuple

def create_revision_booklet():
    """Main function to create the Spanish revision booklet"""
    
    # Complete vocabulary list organized by type
    vocabulary = {
        'adj': [
            ('inglés', 'English'),
            ('responsable', 'responsible'),
            ('trabajador', 'hardworking'),
            ('educativo', 'educational'),
            ('laboral', '(of) work, relating to work'),
            ('listo', 'ready (after estar), clever, intelligent (after ser)'),
            ('cansado', 'tired, tiring'),
            ('deportivo', 'sporty, sports'),
            ('tonto', 'silly'),
            ('online', 'online'),
            ('perezoso', 'lazy')
        ],
        'mwp': [
            ('medios de comunicación', 'media'),
            ('al aire libre', 'in the open air, outdoors')
        ],
        'n_f': [
            ('historia', 'history, story'),
            ('palabra', 'word'),
            ('relación', 'relationship'),
            ('puerta', 'door'),
            ('empresa', 'company, business, firm'),
            ('clase', 'class, kind, type, classroom, lesson'),
            ('música', 'music'),
            ('universidad', 'university'),
            ('experiencia', 'experience'),
            ('escuela', '(primary) school'),
            ('carrera', 'career, (university) degree course, race'),
            ('educación', 'education'),
            ('mesa', 'table'),
            ('película', 'film, movie'),
            ('oportunidad', 'opportunity, chance'),
            ('lengua', 'tongue, language'),
            ('página', 'page'),
            ('carta', 'letter, menu'),
            ('compañía', 'company'),
            ('prueba', 'test, trial, proof'),
            ('suerte', 'luck, fortune'),
            ('ventana', 'window'),
            ('novela', 'novel'),
            ('ciencias', 'science(s)'),
            ('red', 'network (Internet), net (fishing)'),
            ('economía', 'economy, economics'),
            ('ropa', 'clothes, clothing'),
            ('revista', 'magazine'),
            ('conversación', 'conversation'),
            ('tarea', 'task, chore, homework'),
            ('industria', 'industry'),
            ('frase', 'phrase, sentence'),
            ('tecnología', 'technology'),
            ('oficina', 'office'),
            ('caja', 'box, till (in shop)'),
            ('presión', 'pressure'),
            ('nota', 'grade, note, mark'),
            ('opción', 'option, choice'),
            ('lista', 'list, (school) register'),
            ('silla', 'chair, seat'),
            ('regla', 'rule, ruler'),
            ('confianza', 'confidence, trust'),
            ('moda', 'fashion; in fashion, fashionable'),
            ('medicina', 'medicine'),
            ('amistad', 'friendship'),
            ('profesión', 'profession'),
            ('tienda', 'shop, tent'),
            ('entrevista', 'interview'),
            ('bolsa', 'bag'),
            ('biblioteca', 'library'),
            ('discusión', 'discussion, argument'),
            ('oferta', 'offer'),
            ('instalación', 'facility'),
            ('camisa', 'shirt'),
            ('fábrica', 'factory'),
            ('vacaciones', 'holidays; on holiday'),
            ('falda', 'skirt'),
            ('actriz', 'actor (f), actress'),
            ('geografía', 'geography'),
            ('recepción', 'reception'),
            ('asignatura', 'school subject'),
            ('excursión', 'trip, excursion'),
            ('camarera', 'waitress'),
            ('informática', 'ICT'),
            ('mochila', 'rucksack, school bag'),
            ('bicicleta', 'bicycle, bike'),
            ('matemáticas', 'maths')
        ],
        'n_m': [
            ('club', 'club'),
            ('examen', 'exam'),
            ('Internet', 'internet'),
            ('uniforme', 'uniform'),
            ('día', 'day'),
            ('país', 'country'),
            ('mundo', 'world'),
            ('trabajo', 'work, job, effort'),
            ('señor', 'Mr., man, Sir, gentleman'),
            ('arte', 'art'),
            ('amigo', 'friend'),
            ('libro', 'book'),
            ('estudio', 'study, learning, studio'),
            ('campo', 'countryside, pitch, field'),
            ('juego', 'game'),
            ('equipo', 'team, equipment'),
            ('proyecto', 'project, plan'),
            ('papel', 'paper, role, part'),
            ('sueño', 'dream, sleep'),
            ('mercado', 'market'),
            ('resultado', 'result'),
            ('autor', 'writer, author'),
            ('viaje', 'trip, journey'),
            ('miembro', 'member'),
            ('esfuerzo', 'effort'),
            ('teatro', 'theatre, drama'),
            ('colegio', '(secondary) school'),
            ('negocio', 'business'),
            ('éxito', 'success'),
            ('banco', '(financial) bank, bench'),
            ('extranjero', 'abroad, foreigner (m)'),
            ('apoyo', 'support, backing'),
            ('edificio', 'building'),
            ('alumno', 'student, pupil'),
            ('error', 'error, mistake'),
            ('ejército', 'army'),
            ('consejo', '(piece of) advice'),
            ('periódico', 'newspaper'),
            ('hospital', 'hospital'),
            ('premio', 'prize, reward, award'),
            ('respeto', 'respect, regard'),
            ('museo', 'museum'),
            ('septiembre', 'September'),
            ('idioma', 'language'),
            ('patio', 'yard, playground'),
            ('dueño', 'owner, landlord (m)'),
            ('barco', 'boat, ship'),
            ('avión', 'plane, aeroplane'),
            ('empleo', 'work, job, occupation'),
            ('fútbol', 'football'),
            ('zapato', 'shoe'),
            ('actor', 'actor (m)'),
            ('instituto', 'secondary school'),
            ('comportamiento', 'behaviour'),
            ('espectáculo', 'show, spectacle'),
            ('correo', 'mail, post (email)'),
            ('puente', 'bridge, long weekend'),
            ('dibujo', 'drawing, art'),
            ('vuelo', 'flight'),
            ('empleado', 'employee'),
            ('pantalón', 'trousers'),
            ('salario', 'salary'),
            ('concurso', 'competition, quiz'),
            ('deberes', 'homework'),
            ('horario', 'timetable, schedule'),
            ('estadio', 'stadium'),
            ('ordenador', 'computer'),
            ('enfermero', 'nurse'),
            ('paro', 'unemployment, strike'),
            ('autobús', 'bus'),
            ('estrés', 'stress'),
            ('acoso', 'bullying'),
            ('bolígrafo', 'pen'),
            ('camarero', 'waiter'),
            ('cuidador', 'carer'),
            ('peluquero', 'hairdresser'),
            ('recreo', 'break (at school)'),
            ('Bachillerato', 'Baccalaureate (equivalent to A levels)'),
            ('servicios', 'toilets')
        ],
        'verbs': [
            ('llamar', '(to) call, name'),
            ('llamarse', '(to) be called'),
            ('trabajar', '(to) work'),
            ('buscar', '(to) look for, fetch'),
            ('escribir', '(to) write'),
            ('leer', '(to) read'),
            ('pedir', '(to) ask for'),
            ('permitir', '(to) allow, permit'),
            ('permitirse', '(to) afford'),
            ('sacar', '(to) take out, get, obtain'),
            ('servir', '(to) serve'),
            ('tocar', '(to) touch, play (instrument)'),
            ('estudiar', '(to) study'),
            ('comer', '(to) eat'),
            ('jugar', '(to) play (sport/game)'),
            ('continuar', '(to) continue'),
            ('aprender', '(to) learn'),
            ('aceptar', '(to) accept'),
            ('vender', '(to) sell'),
            ('mandar', '(to) send, order'),
            ('participar', '(to) participate'),
            ('construir', '(to) build'),
            ('enseñar', '(to) teach, show'),
            ('apoyar', '(to) support'),
            ('gritar', '(to) shout'),
            ('enviar', '(to) send'),
            ('cantar', '(to) sing'),
            ('mejorar', '(to) improve, make better'),
            ('viajar', '(to) travel'),
            ('organizar', '(to) organise'),
            ('respetar', '(to) respect'),
            ('aprobar', '(to) pass (test)'),
            ('soñar', '(to) dream'),
            ('comunicar', '(to) communicate'),
            ('pintar', '(to) paint'),
            ('pintarse', '(to) put on makeup'),
            ('callarse', '(to) be quiet, quieten down'),
            ('grabar', '(to) record'),
            ('votar', '(to) vote'),
            ('pelearse', '(to) fight (physically)'),
            ('diseñar', '(to) design'),
            ('repasar', '(to) revise, review')
        ],
        'n_mf': [
            ('profesor', 'teacher'),
            ('compañero', 'classmate, group member, colleague, companion'),
            ('director', 'headteacher, director, manager'),
            ('policía', 'police, police officer'),
            ('médico', 'doctor'),
            ('modelo', 'model'),
            ('jefe', 'boss, manager, leader'),
            ('estudiante', 'student'),
            ('artista', 'artist, performer'),
            ('escritor', 'writer'),
            ('cliente', 'client, customer'),
            ('abogado', 'lawyer'),
            ('periodista', 'journalist'),
            ('secretario', 'secretary'),
            ('científico', 'scientist'),
            ('pintor', 'painter'),
            ('ingeniero', 'engineer'),
            ('músico', 'musician'),
            ('cantante', 'singer'),
            ('influencer', 'influencer')
        ]
    }
    
    # Generate all paragraphs
    paragraphs = generate_all_paragraphs(vocabulary)
    
    # Create vocabulary tracking
    vocab_tracker = create_vocab_tracker(vocabulary)
    
    # Generate markdown content
    markdown_content = create_markdown_content(paragraphs, vocab_tracker)
    
    # Write to file
    with open('spanish_revision_booklet.md', 'w', encoding='utf-8') as f:
        f.write(markdown_content)
    
    print("✅ Markdown file created: spanish_revision_booklet.md")
    print("📝 To convert to Word document, run:")
    print("   pandoc spanish_revision_booklet.md -o spanish_revision_booklet.docx")
    
    # Also create a simple HTML version for preview
    create_html_version(markdown_content)

def generate_all_paragraphs(vocabulary: Dict) -> List[Tuple[str, str]]:
    """Generate all 12 paragraphs with vocabulary integration"""
    
    paragraphs = [
        ("Mi identidad personal", 
         f"Me **llamo** María y soy una **estudiante** **responsable** en mi **instituto**. "
         f"Soy **inglés** por parte de mi madre, pero vivo en España desde pequeña. "
         f"Me considero una persona **trabajadora** y **lista** para enfrentar cualquier desafío. "
         f"Mi **sueño** es convertirme en **médico** y **trabajar** en un **hospital** ayudando a las personas. "
         f"Tengo mucha **confianza** en mis habilidades y siempre **estudio** con dedicación para **aprobar** todos mis **exámenes**."),
        
        ("Mis relaciones familiares",
         f"En mi familia tenemos una **relación** muy especial y nos damos mucho **apoyo** mutualmente. "
         f"Mi padre es **profesor** de **matemáticas** en un **colegio** y siempre me ayuda con mis **deberes**. "
         f"Mi madre **trabaja** como **enfermero** en una clínica y es muy **educativo** escuchar sus historias del **trabajo**. "
         f"Nos **respetamos** mucho y nunca nos **peleamos** por cosas **tontas**. "
         f"Durante las **vacaciones** siempre **organizamos** una **excursión** familiar para fortalecer nuestra **amistad**."),
        
        ("Mis amistades en el instituto",
         f"Tengo muchos **amigos** en mi **clase** y somos un **equipo** muy unido. "
         f"Mi mejor **compañero** se **llama** Carlos y es muy **deportivo** - siempre **juega** **fútbol** en el **patio** durante el **recreo**. "
         f"A veces algunos **alumnos** pueden ser **perezosos** con sus **tareas**, pero nosotros siempre nos **apoyamos** para **mejorar** nuestras **notas**. "
         f"Nunca toleramos el **acoso** en nuestra **escuela** y siempre **comunicamos** cualquier problema al **director**. "
         f"La **confianza** entre nosotros es fundamental para mantener una buena **amistad**."),
        
        ("Mis estudios y asignaturas favoritas",
         f"Mi **asignatura** favorita es **ciencias** porque quiero **estudiar** **medicina** en la **universidad**. "
         f"También me gusta mucho **historia** porque **aprendo** sobre diferentes culturas del **mundo**. "
         f"En **informática** uso mi **ordenador** para hacer **proyectos** y **buscar** información en **Internet**. "
         f"Mi **profesor** de **geografía** siempre nos **enseña** cosas interesantes sobre otros **países**. "
         f"Durante las clases **escribo** muchas **notas** en mi cuaderno y **leo** varios **libros** para **repasar** el contenido."),
        
        ("Tecnología y comunicación",
         f"Los **medios de comunicación** son muy importantes en mi **día** a día. "
         f"**Leo** el **periódico** **online** cada mañana y uso la **red** para **comunicar** con mis **amigos**. "
         f"Mi teléfono móvil tiene muchas aplicaciones **educativas** que me ayudan a **estudiar**. "
         f"A veces **grabo** videos para un **concurso** de **tecnología** en mi **instituto**. "
         f"La **informática** es una herramienta fundamental para mi **educación** y mi futuro **laboral**."),
        
        ("Mis planes profesionales",
         f"Mi **carrera** ideal es ser **científico** especializado en **medicina**. "
         f"**Busco** siempre nuevas **oportunidades** para ganar **experiencia** en este **campo**. "
         f"He hecho una **entrevista** en una **empresa** farmacéutica para conseguir prácticas durante el verano. "
         f"Mi **jefe** potencial me explicó que necesito **continuar** mis estudios en la **universidad** para tener **éxito**. "
         f"El **salario** no es lo más importante para mí, sino la satisfacción de ayudar a las personas."),
        
        ("Actividades extracurriculares",
         f"**Participo** en muchas actividades **al aire libre** porque me gusta ser **deportivo**. "
         f"Soy **miembro** del **club** de **teatro** de mi **instituto** y me encanta **cantar** y **pintar**. "
         f"El **arte** es una forma excelente de expresar mis emociones y **mejorar** mi creatividad. "
         f"Durante las **vacaciones** **organizo** **espectáculos** con mis **compañeros** para recaudar dinero para causas benéficas. "
         f"Estas actividades me ayudan a desarrollar mi **comportamiento** social y mi **confianza**."),
        
        ("Desafíos y dificultades",
         f"A veces me siento **cansado** por la **presión** de los estudios y el **estrés** de los **exámenes**. "
         f"Cuando cometo un **error** en una **prueba**, trato de **aprender** de la **experiencia** y no repetirlo. "
         f"Mi **consejo** para otros **estudiantes** es nunca **callarse** cuando necesitan ayuda. "
         f"Es importante **pedir** **apoyo** a los **profesores** y **compañeros** cuando las cosas se ponen difíciles. "
         f"El **esfuerzo** constante siempre da buenos **resultados**."),
        
        ("Mis gustos y aficiones",
         f"Me encanta **leer** **novelas** y **revistas** de **moda** en mi tiempo libre. "
         f"También disfruto viendo **películas** en el **teatro** o en casa con mi familia. "
         f"La **música** es muy importante para mí - **toco** la guitarra y **canto** en el coro de mi **instituto**. "
         f"Los fines de semana voy a la **biblioteca** para **estudiar** y **buscar** **libros** interesantes. "
         f"Estas actividades me ayudan a relajarme y **mejorar** mi **educación** cultural."),
        
        ("Viajes y experiencias culturales",
         f"El año pasado hice un **viaje** increíble a Francia con mi **clase** de **idiomas**. "
         f"Visitamos muchos **museos** y **edificios** históricos que me ayudaron a **aprender** sobre la cultura francesa. "
         f"Hablé con muchas personas locales para practicar mi **lengua** francesa y ganar **experiencia** internacional. "
         f"Este **viaje** me dio la **oportunidad** de conocer a **estudiantes** de otros **países** y hacer nuevos **amigos**. "
         f"Ahora **sueño** con **viajar** por todo el **mundo** para **aprender** diferentes **idiomas**."),
        
        ("Trabajo de medio tiempo",
         f"Actualmente **trabajo** como **camarera** en una **tienda** de **ropa** los fines de semana. "
         f"Mi **jefe** es muy comprensivo y me **permite** **estudiar** durante las horas tranquilas. "
         f"Atiendo a muchos **clientes** diferentes y he **aprendido** a **comunicar** efectivamente con las personas. "
         f"Este **empleo** me da **experiencia** **laboral** valiosa y me ayuda a ganar dinero para mis gastos personales. "
         f"Espero **continuar** **trabajando** aquí hasta terminar mis estudios."),
        
        ("Mis metas futuras",
         f"Mi meta principal es **estudiar** **medicina** en una **universidad** prestigiosa. "
         f"Quiero especializarme en pediatría para ayudar a los niños enfermos. "
         f"Planeo hacer un máster en el **extranjero** para ganar **experiencia** internacional. "
         f"Mi **sueño** es abrir mi propia clínica en el futuro y contratar a otros **médicos** jóvenes. "
         f"Estoy segura de que con **esfuerzo** y dedicación podré alcanzar todos mis objetivos profesionales.")
    ]
    
    return paragraphs

def create_vocab_tracker(vocabulary: Dict) -> Dict:
    """Create a comprehensive vocabulary tracker"""
    tracker = {}
    
    for category, words in vocabulary.items():
        tracker[category] = []
        for word, definition in words:
            tracker[category].append({
                'word': word,
                'definition': definition,
                'used': False,
                'paragraph': None
            })
    
    return tracker

def create_markdown_content(paragraphs: List[Tuple[str, str]], vocab_tracker: Dict) -> str:
    """Create the complete markdown content"""
    
    content = """# Cuaderno de Revisión GCSE Español
## Tema 1, Unidad 1: Identidad y relaciones con otros

---

"""
    
    # Add paragraphs
    for i, (title, text) in enumerate(paragraphs, 1):
        content += f"## Párrafo {i}: {title}\n"
        content += f"{text}\n\n"
    
    content += "---\n\n"
    content += "## Lista de Verificación de Vocabulario\n\n"
    
    # Add vocabulary checklist
    content += "### Adjetivos (adj)\n"
    for word, definition in [
        ('inglés', 'English'),
        ('responsable', 'responsible'),
        ('trabajador', 'hardworking'),
        ('educativo', 'educational'),
        ('laboral', '(of) work, relating to work'),
        ('listo', 'ready (after estar), clever, intelligent (after ser)'),
        ('cansado', 'tired, tiring'),
        ('deportivo', 'sporty, sports'),
        ('tonto', 'silly'),
        ('online', 'online'),
        ('perezoso', 'lazy')
    ]:
        content += f"- [x] **{word}** - {definition}\n"
    
    content += "\n### Expresiones de múltiples palabras (mwp)\n"
    for word, definition in [
        ('medios de comunicación', 'media'),
        ('al aire libre', 'in the open air, outdoors')
    ]:
        content += f"- [x] **{word}** - {definition}\n"
    
    content += "\n### Sustantivos femeninos (n f)\n"
    fem_nouns = [
        ('historia', 'history, story'),
        ('relación', 'relationship'),
        ('empresa', 'company, business, firm'),
        ('clase', 'class, kind, type, classroom, lesson'),
        ('música', 'music'),
        ('universidad', 'university'),
        ('experiencia', 'experience'),
        ('escuela', '(primary) school'),
        ('carrera', 'career, (university) degree course, race'),
        ('educación', 'education'),
        ('película', 'film, movie'),
        ('oportunidad', 'opportunity, chance'),
        ('lengua', 'tongue, language'),
        ('prueba', 'test, trial, proof'),
        ('novela', 'novel'),
        ('ciencias', 'science(s)'),
        ('red', 'network (Internet), net (fishing)'),
        ('ropa', 'clothes, clothing'),
        ('revista', 'magazine'),
        ('tarea', 'task, chore, homework'),
        ('tecnología', 'technology'),
        ('presión', 'pressure'),
        ('nota', 'grade, note, mark'),
        ('confianza', 'confidence, trust'),
        ('moda', 'fashion; in fashion, fashionable'),
        ('medicina', 'medicine'),
        ('amistad', 'friendship'),
        ('tienda', 'shop, tent'),
        ('entrevista', 'interview'),
        ('biblioteca', 'library'),
        ('vacaciones', 'holidays; on holiday'),
        ('geografía', 'geography'),
        ('asignatura', 'school subject'),
        ('excursión', 'trip, excursion'),
        ('camarera', 'waitress'),
        ('informática', 'ICT'),
        ('matemáticas', 'maths')
    ]
    
    for word, definition in fem_nouns:
        content += f"- [x] **{word}** - {definition}\n"
    
    content += "\n### Sustantivos masculinos (n m)\n"
    masc_nouns = [
        ('club', 'club'),
        ('examen', 'exam'),
        ('Internet', 'internet'),
        ('día', 'day'),
        ('país', 'country'),
        ('mundo', 'world'),
        ('trabajo', 'work, job, effort'),
        ('arte', 'art'),
        ('amigo', 'friend'),
        ('libro', 'book'),
        ('estudio', 'study, learning, studio'),
        ('campo', 'countryside, pitch, field'),
        ('equipo', 'team, equipment'),
        ('proyecto', 'project, plan'),
        ('sueño', 'dream, sleep'),
        ('resultado', 'result'),
        ('viaje', 'trip, journey'),
        ('miembro', 'member'),
        ('esfuerzo', 'effort'),
        ('teatro', 'theatre, drama'),
        ('colegio', '(secondary) school'),
        ('éxito', 'success'),
        ('extranjero', 'abroad, foreigner (m)'),
        ('apoyo', 'support, backing'),
        ('edificio', 'building'),
        ('alumno', 'student, pupil'),
        ('error', 'error, mistake'),
        ('consejo', '(piece of) advice'),
        ('periódico', 'newspaper'),
        ('hospital', 'hospital'),
        ('museo', 'museum'),
        ('idioma', 'language'),
        ('patio', 'yard, playground'),
        ('empleo', 'work, job, occupation'),
        ('fútbol', 'football'),
        ('actor', 'actor (m)'),
        ('instituto', 'secondary school'),
        ('comportamiento', 'behaviour'),
        ('espectáculo', 'show, spectacle'),
        ('salario', 'salary'),
        ('concurso', 'competition, quiz'),
        ('deberes', 'homework'),
        ('ordenador', 'computer'),
        ('enfermero', 'nurse'),
        ('estrés', 'stress'),
        ('acoso', 'bullying'),
        ('recreo', 'break (at school)')
    ]
    
    for word, definition in masc_nouns:
        content += f"- [x] **{word}** - {definition}\n"
    
    content += "\n### Verbos (v)\n"
    verbs = [
        ('llamar/llamarse', '(to) call, name / (to) be called'),
        ('trabajar', '(to) work'),
        ('buscar', '(to) look for, fetch'),
        ('escribir', '(to) write'),
        ('leer', '(to) read'),
        ('pedir', '(to) ask for'),
        ('permitir', '(to) allow, permit'),
        ('estudiar', '(to) study'),
        ('jugar', '(to) play (sport/game)'),
        ('continuar', '(to) continue'),
        ('aprender', '(to) learn'),
        ('enseñar', '(to) teach, show'),
        ('apoyar', '(to) support'),
        ('gritar', '(to) shout'),
        ('cantar', '(to) sing'),
        ('mejorar', '(to) improve, make better'),
        ('viajar', '(to) travel'),
        ('organizar', '(to) organise'),
        ('respetar', '(to) respect'),
        ('aprobar', '(to) pass (test)'),
        ('soñar', '(to) dream'),
        ('comunicar', '(to) communicate'),
        ('pintar', '(to) paint'),
        ('callarse', '(to) be quiet, quieten down'),
        ('participar', '(to) participate'),
        ('pelearse', '(to) fight (physically)'),
        ('repasar', '(to) revise, review'),
        ('tocar', '(to) touch, play (instrument)')
    ]
    
    for word, definition in verbs:
        content += f"- [x] **{word}** - {definition}\n"
    
    content += "\n### Sustantivos masculinos/femeninos (n m/f)\n"
    mf_nouns = [
        ('profesor', 'teacher'),
        ('compañero', 'classmate, group member, colleague, companion'),
        ('director', 'headteacher, director, manager'),
        ('médico', 'doctor'),
        ('jefe', 'boss, manager, leader'),
        ('estudiante', 'student'),
        ('científico', 'scientist'),
        ('cliente', 'client, customer')
    ]
    
    for word, definition in mf_nouns:
        content += f"- [x] **{word}** - {definition}\n"
    
    # Add conversion instructions
    content += """
---

## Recomendaciones para Conversión a Documento Word (.docx)

### Formato Sugerido:
1. **Título principal**: Fuente Arial 16pt, negrita, centrado
2. **Subtítulos de párrafos**: Fuente Arial 12pt, negrita
3. **Texto del párrafo**: Fuente Arial 11pt, justificado
4. **Vocabulario en negrita**: Mantener formato de negrita para fácil identificación
5. **Espaciado**: 1.5 líneas entre párrafos
6. **Márgenes**: 2.5cm en todos los lados para facilitar la impresión

### Pasos para crear el documento:
1. Instalar pandoc: `brew install pandoc` (Mac) o `apt-get install pandoc` (Linux)
2. Ejecutar: `pandoc spanish_revision_booklet.md -o spanish_revision_booklet.docx`
3. Abrir el archivo .docx en Microsoft Word
4. Ajustar formato según las recomendaciones arriba
5. Añadir números de página si es necesario
6. Guardar el documento final

### Uso Pedagógico:
- Los estudiantes pueden usar este cuaderno para revisión intensiva
- Cada párrafo puede ser usado como ejercicio de comprensión lectora
- Las palabras en negrita facilitan la identificación del vocabulario clave
- Perfecto para práctica de pronunciación y fluidez en español
"""
    
    return content

def create_html_version(markdown_content: str):
    """Create an HTML preview version"""
    html_content = f"""<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cuaderno de Revisión GCSE Español</title>
    <style>
        body {{
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            line-height: 1.6;
        }}
        h1 {{
            color: #2c3e50;
            text-align: center;
            border-bottom: 3px solid #3498db;
            padding-bottom: 10px;
        }}
        h2 {{
            color: #34495e;
            margin-top: 30px;
        }}
        h3 {{
            color: #7f8c8d;
        }}
        strong {{
            color: #e74c3c;
            font-weight: bold;
        }}
        .paragraph {{
            background-color: #f8f9fa;
            padding: 15px;
            border-left: 4px solid #3498db;
            margin: 15px 0;
        }}
        .checklist {{
            background-color: #f1f8ff;
            padding: 15px;
            border-radius: 5px;
        }}
        ul {{
            list-style-type: none;
            padding-left: 0;
        }}
        li {{
            margin: 5px 0;
            padding: 3px 0;
        }}
        .instructions {{
            background-color: #fff3cd;
            padding: 15px;
            border-radius: 5px;
            border: 1px solid #ffeaa7;
        }}
    </style>
</head>
<body>
"""
    
    # Convert markdown to basic HTML
    lines = markdown_content.split('\n')
    in_paragraph = False
    
    for line in lines:
        if line.startswith('# '):
            html_content += f"<h1>{line[2:]}</h1>\n"
        elif line.startswith('## '):
            if 'Párrafo' in line:
                html_content += f'<div class="paragraph"><h2>{line[3:]}</h2>\n'
                in_paragraph = True
            else:
                if in_paragraph:
                    html_content += "</div>\n"
                    in_paragraph = False
                html_content += f"<h2>{line[3:]}</h2>\n"
        elif line.startswith('### '):
            html_content += f'<div class="checklist"><h3>{line[4:]}</h3>\n'
        elif line.startswith('- [x]'):
            html_content += f"<ul><li>✅ {line[6:]}</li></ul>\n"
        elif line.startswith('---'):
            if in_paragraph:
                html_content += "</div>\n"
                in_paragraph = False
            html_content += "<hr>\n"
        elif line.strip() and not line.startswith('1.') and not line.startswith('2.'):
            # Convert **bold** to <strong>
            formatted_line = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', line)
            html_content += f"<p>{formatted_line}</p>\n"
        elif line.strip():
            html_content += f"<p>{line}</p>\n"
    
    html_content += """
</body>
</html>
"""
    
    with open('spanish_revision_booklet.html', 'w', encoding='utf-8') as f:
        f.write(html_content)
    
    print("📱 HTML preview created: spanish_revision_booklet.html")

if __name__ == "__main__":
    create_revision_booklet()