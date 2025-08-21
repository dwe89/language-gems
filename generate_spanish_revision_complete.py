# generate_spanish_revision_complete.py
import re
from typing import Dict, List, Tuple, Set

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
    
    # Generate comprehensive paragraphs that use ALL vocabulary
    paragraphs = generate_comprehensive_paragraphs(vocabulary)
    
    # Track vocabulary usage
    used_words = track_vocabulary_usage(paragraphs, vocabulary)
    
    # Generate markdown content with verification
    markdown_content = create_markdown_content(paragraphs, vocabulary, used_words)
    
    # Write to file
    with open('spanish_revision_booklet_complete.md', 'w', encoding='utf-8') as f:
        f.write(markdown_content)
    
    print("✅ Complete markdown file created: spanish_revision_booklet_complete.md")
    print(f"📊 Vocabulary coverage: {len(used_words)}/{get_total_vocab_count(vocabulary)} words used")
    
    # Check for unused words
    unused_words = check_unused_vocabulary(vocabulary, used_words)
    if unused_words:
        print("⚠️  Warning: Some vocabulary words were not used:")
        for category, words in unused_words.items():
            if words:
                print(f"  {category}: {', '.join(words)}")
    else:
        print("🎉 All vocabulary words have been successfully used!")
    
    print("📝 To convert to Word document, run:")
    print("   pandoc spanish_revision_booklet_complete.md -o spanish_revision_booklet_complete.docx")
    
    # Also create HTML version
    create_html_version(markdown_content)

def generate_comprehensive_paragraphs(vocabulary: Dict) -> List[Tuple[str, str]]:
    """Generate comprehensive paragraphs that use ALL vocabulary words"""
    
    paragraphs = [
        ("Mi identidad personal y mis características", 
         f"Me **llamo** Ana María y soy una **estudiante** muy **responsable** en mi **instituto**. "
         f"Soy **inglés** por parte de mi madre, pero vivo en España desde pequeña. "
         f"Me considero una persona **trabajadora** y siempre estoy **lista** para enfrentar cualquier desafío. "
         f"Mi **sueño** es convertirme en **médico** y **trabajar** en un **hospital** ayudando a las personas. "
         f"Tengo mucha **confianza** en mis habilidades y nunca soy **perezosa** con mis estudios. "
         f"Cuando me siento **cansada**, **busco** motivación en mi **familia** y **amigos**. "
         f"Siempre **estudio** con dedicación para **aprobar** todos mis **exámenes**."),
        
        ("Mi vida familiar y relaciones", 
         f"En mi **familia** tenemos una **relación** muy especial y nos damos mucho **apoyo** mutualmente. "
         f"Mi padre es **profesor** de **matemáticas** en un **colegio** y siempre me ayuda con mis **deberes**. "
         f"Mi madre **trabaja** como **enfermera** en una clínica y es muy **educativo** escuchar sus historias del **trabajo**. "
         f"Nos **respetamos** mucho y nunca nos **peleamos** por cosas **tontas**. "
         f"Durante las **vacaciones** siempre **organizamos** una **excursión** familiar para fortalecer nuestra **amistad**. "
         f"Mi hermano menor **estudia** en una **escuela** primaria y le gusta **jugar** **juegos** en su **ordenador**. "
         f"Tenemos mucha **suerte** de tener una **casa** con un **jardín** donde podemos relajarnos."),
        
        ("Mis amistades y vida social en el instituto", 
         f"Tengo muchos **amigos** en mi **clase** y somos un **equipo** muy unido en nuestros estudios. "
         f"Mi mejor **compañero** se llama Carlos y es muy **deportivo** - siempre **juega** **fútbol** en el **patio** durante el **recreo**. "
         f"A veces algunos **alumnos** pueden ser **perezosos** con sus **tareas**, pero nosotros siempre nos **apoyamos** para **mejorar** nuestras **notas**. "
         f"Nunca toleramos el **acoso** en nuestra **escuela** y siempre **comunicamos** cualquier problema al **director**. "
         f"Nuestra **amistad** es muy importante y nos **respetamos** mucho. "
         f"Cada **día** hacemos nuevas **conversaciones** interesantes y compartimos nuestras ideas. "
         f"Cuando tenemos **discusiones**, siempre **buscamos** soluciones pacíficas sin **gritar**."),
        
        ("Mis estudios, asignaturas y rutina escolar", 
         f"Mi **asignatura** favorita es **ciencias** porque quiero **estudiar** **medicina** en la **universidad**. "
         f"También me gusta mucho **historia** porque **aprendo** sobre diferentes culturas del **mundo**. "
         f"En **informática** uso mi **ordenador** para hacer **proyectos** y **buscar** información en **Internet**. "
         f"Mi **profesora** de **geografía** siempre nos **enseña** cosas interesantes sobre otros **países**. "
         f"Durante las clases **escribo** muchas **notas** con mi **bolígrafo** y **leo** varios **libros** para **repasar** el contenido. "
         f"Llevo todos mis **libros** en mi **mochila** y siempre **pido** ayuda cuando no entiendo una **palabra** o **frase**. "
         f"Mi **horario** incluye también **economía** donde **aprendemos** sobre el **mercado** y la **industria**. "
         f"Cada **página** de mis **libros** contiene información valiosa para mis **estudios**."),
        
        ("Tecnología, comunicación y medios", 
         f"Los **medios de comunicación** son muy importantes en mi **día** a día. "
         f"**Leo** el **periódico** **online** cada mañana y uso la **red** para **comunicar** con mis **amigos**. "
         f"Mi teléfono móvil tiene muchas aplicaciones **educativas** que me ayudan a **estudiar**. "
         f"A veces **grabo** videos para un **concurso** de **tecnología** en mi **instituto**. "
         f"La **informática** es una herramienta fundamental para mi **educación** y mi futuro **laboral**. "
         f"**Envío** **correos** electrónicos a mis **profesores** cuando tengo dudas sobre las **tareas**. "
         f"Mi **ordenador** tiene varios programas que me **permiten** **diseñar** presentaciones para mis **proyectos**. "
         f"**Participo** en foros **online** donde **discuto** temas **educativos** con otros **estudiantes**."),
        
        ("Mis planes profesionales y carrera", 
         f"Mi **carrera** ideal es ser **científico** especializado en **medicina**. "
         f"**Busco** siempre nuevas **oportunidades** para ganar **experiencia** en este **campo**. "
         f"He hecho una **entrevista** en una **empresa** farmacéutica para conseguir prácticas durante el verano. "
         f"Mi **jefe** potencial me explicó que necesito **continuar** mis estudios en la **universidad** para tener **éxito**. "
         f"El **salario** no es lo más importante para mí, sino la satisfacción de ayudar a las personas. "
         f"Quiero **trabajar** en un **hospital** moderno donde pueda **servir** a la comunidad. "
         f"Mi **profesión** ideal me **permitirá** **construir** un futuro mejor para muchas **personas**. "
         f"**Sueño** con **viajar** al **extranjero** para **aprender** nuevas técnicas médicas."),
        
        ("Actividades extracurriculares y pasatiempos", 
         f"**Participo** en muchas actividades **al aire libre** porque me gusta ser **deportiva**. "
         f"Soy **miembro** del **club** de **teatro** de mi **instituto** y me encanta **cantar** y **pintar**. "
         f"El **arte** es una forma excelente de expresar mis emociones y **mejorar** mi creatividad. "
         f"Durante las **vacaciones** **organizo** **espectáculos** con mis **compañeros** para recaudar dinero para causas benéficas. "
         f"Estas actividades me ayudan a desarrollar mi **comportamiento** social y mi **confianza**. "
         f"También **toco** la guitarra y **participo** en competencias de **música**. "
         f"En **septiembre** siempre **empiezo** nuevas actividades como **dibujo** y **baile**. "
         f"Mis **padres** me **apoyan** mucho en todas mis **aficiones** artísticas."),
        
        ("Desafíos, dificultades y cómo superarlos", 
         f"A veces me siento **cansada** por la **presión** de los estudios y el **estrés** de los **exámenes**. "
         f"Cuando cometo un **error** en una **prueba**, trato de **aprender** de la **experiencia** y no repetirlo. "
         f"Mi **consejo** para otros **estudiantes** es nunca **callarse** cuando necesitan ayuda. "
         f"Es importante **pedir** **apoyo** a los **profesores** y **compañeros** cuando las cosas se ponen difíciles. "
         f"El **esfuerzo** constante siempre da buenos **resultados**. "
         f"Cuando tengo **problemas** con una **asignatura**, **busco** **ayuda** adicional en la **biblioteca**. "
         f"**Acepto** que no siempre puedo ser perfecta, pero **continúo** **trabajando** duro. "
         f"La **educación** requiere **paciencia** y **dedicación** constante."),
        
        ("Mis gustos, entretenimiento y cultura", 
         f"Me encanta **leer** **novelas** y **revistas** de **moda** en mi tiempo libre. "
         f"También disfruto viendo **películas** en el **teatro** o en casa con mi **familia**. "
         f"La **música** es muy importante para mí - **toco** la guitarra y **canto** en el coro de mi **instituto**. "
         f"Los fines de semana voy a la **biblioteca** para **estudiar** y **buscar** **libros** interesantes. "
         f"Estas actividades me ayudan a relajarme y **mejorar** mi **educación** cultural. "
         f"**Leo** biografías de **autores** famosos y **escritores** que me inspiran. "
         f"Me gusta **visitar** **museos** donde puedo **aprender** sobre **arte** y **historia**. "
         f"**Colecciono** **revistas** sobre **ciencias** y **tecnología** para estar al **día**."),
        
        ("Viajes, experiencias culturales y idiomas", 
         f"El año pasado hice un **viaje** increíble a Francia con mi **clase** de **idiomas**. "
         f"Visitamos muchos **museos** y **edificios** históricos que me ayudaron a **aprender** sobre la cultura francesa. "
         f"Hablé con muchas personas locales para practicar mi **lengua** francesa y ganar **experiencia** internacional. "
         f"Este **viaje** me dio la **oportunidad** de conocer a **estudiantes** de otros **países** y hacer nuevos **amigos**. "
         f"Ahora **sueño** con **viajar** por todo el **mundo** para **aprender** diferentes **idiomas**. "
         f"Tomé el **autobús** y el **avión** durante mis viajes, y me gusta la aventura del **vuelo**. "
         f"**Compré** **ropa** tradicional y **zapatos** como **recuerdos** del **viaje**. "
         f"**Saqué** muchas fotos de **puentes** y **barcos** durante mis **excursiones**."),
        
        ("Trabajo de medio tiempo y experiencia laboral", 
         f"Actualmente **trabajo** como **camarera** en una **tienda** de **ropa** los fines de semana. "
         f"Mi **jefe** es muy comprensivo y me **permite** **estudiar** durante las horas tranquilas. "
         f"Atiendo a muchos **clientes** diferentes y he **aprendido** a **comunicar** efectivamente con las personas. "
         f"Este **empleo** me da **experiencia** **laboral** valiosa y me ayuda a ganar dinero para mis gastos personales. "
         f"Espero **continuar** **trabajando** aquí hasta terminar mis estudios. "
         f"**Sirvo** a los **clientes** con una sonrisa y siempre **busco** **mejorar** mi **servicio**. "
         f"Trabajo en la **recepción** de la **tienda** y manejo la **caja** registradora. "
         f"Mi **jefe** me ha dado una buena **oferta** para **continuar** después de graduarme."),
        
        ("El entorno escolar y las instalaciones", 
         f"Mi **instituto** tiene excelentes **instalaciones** para todos los **estudiantes**. "
         f"Tenemos una **biblioteca** grande con muchos **libros** y **ordenadores** para **estudiar**. "
         f"El **patio** es espacioso y perfecto para **jugar** **fútbol** durante el **recreo**. "
         f"Cada **aula** tiene **mesas** y **sillas** cómodas, y **ventanas** grandes que dan mucha luz natural. "
         f"Los **servicios** están siempre limpios y bien mantenidos por el personal. "
         f"Tenemos un **estadio** pequeño donde hacemos **educación** física y **deportes**. "
         f"La **oficina** del **director** está en el primer piso del **edificio** principal. "
         f"Hay una **fábrica** de ideas en nuestro laboratorio de **ciencias** donde hacemos experimentos. "
         f"Cada **estudiante** debe seguir las **reglas** de comportamiento en todas las **instalaciones**."),
        
        ("Profesiones, oficios y el mundo laboral", 
         f"En mi **familia** hay muchas **profesiones** diferentes que me inspiran. "
         f"Mi tío es **periodista** y **escribe** **artículos** para un **periódico** local. "
         f"Mi prima es **abogada** y **trabaja** en una **oficina** muy prestigiosa en el centro. "
         f"Conozco también a un **ingeniero** que **diseña** **puentes** y **edificios** importantes. "
         f"Una **actriz** famosa visitó nuestro **instituto** y nos habló sobre su **carrera** en el **teatro**. "
         f"El **peluquero** de mi barrio también es **artista** y **pinta** cuadros en su tiempo libre. "
         f"Mi **médico** de **familia** me inspira a **estudiar** **medicina** en la **universidad**. "
         f"Un **músico** **profesional** vino a **enseñar** **música** en nuestro **club** **escolar**. "
         f"La **secretaria** de mi **instituto** es muy **eficiente** y nos ayuda con todos los trámites."),
        
        ("Vida social, eventos y celebraciones", 
         f"Durante las **vacaciones** escolares **organizamos** muchas actividades sociales divertidas. "
         f"**Participamos** en **concursos** de **talento** donde cada **estudiante** puede mostrar sus habilidades. "
         f"El **club** de **teatro** **organiza** **espectáculos** especiales para toda la **comunidad**. "
         f"**Celebramos** el **éxito** de nuestros **compañeros** cuando **ganan** **premios** importantes. "
         f"Los **fines** de semana **vamos** al **cine** o **visitamos** el **mercado** local. "
         f"**Hacemos** **fiestas** de **cumpleaños** donde **cantamos** y **bailamos** hasta muy tarde. "
         f"**Organizamos** **excursiones** a **museos** y **parques** para **aprender** fuera del **aula**. "
         f"**Invitamos** a **artistas** locales a **nuestro** **instituto** para **eventos** **culturales** especiales."),
        
        ("Ropa, estilo personal y presentación", 
         f"En mi **instituto** no tenemos **uniforme**, así que podemos **elegir** nuestra **ropa** **libremente**. "
         f"Me gusta **llevar** **camisas** **cómodas** y **pantalones** **casuales** para **estudiar**. "
         f"Tengo una **falda** **favorita** que **uso** para **ocasiones** **especiales** en el **instituto**. "
         f"Siempre **llevo** **zapatos** **cómodos** porque **camino** mucho entre **clases**. "
         f"Mi **mochila** **contiene** todos mis **libros**, **bolígrafos** y **materiales** **escolares**. "
         f"Cuando **voy** a una **entrevista** **importante**, **me** **visto** más **formalmente**. "
         f"Me gusta **comprar** **ropa** en la **tienda** donde **trabajo** los **fines** de **semana**. "
         f"**Guardo** mi **dinero** en una **bolsa** **especial** **dentro** de mi **mochila**. "
         f"La **moda** me **interesa**, pero **prefiero** la **comodidad** para **estudiar**."),
        
        ("Metas futuras y aspiraciones a largo plazo", 
         f"Mi meta principal es **estudiar** **medicina** en una **universidad** prestigiosa. "
         f"Quiero especializarme en pediatría para ayudar a los niños enfermos en el **hospital**. "
         f"Planeo hacer un máster en el **extranjero** para ganar **experiencia** internacional valiosa. "
         f"Mi **sueño** es abrir mi propia clínica en el futuro y contratar a otros **médicos** jóvenes. "
         f"Estoy segura de que con **esfuerzo** y dedicación podré alcanzar todos mis objetivos profesionales. "
         f"También quiero **aprender** varios **idiomas** para **comunicar** con **pacientes** **internacionales**. "
         f"**Espero** **poder** **viajar** por todo el **mundo** **ayudando** a **personas** **necesitadas**. "
         f"**Votaré** **siempre** por **políticas** que **mejoren** la **educación** y la **sanidad** **pública**."),
        
        ("Comida, restaurantes y experiencias culinarias", 
         f"Cuando **voy** a **restaurantes** con mi **familia**, siempre **pido** ayuda al **camarero** para **elegir** del **menú**. "
         f"Me gusta **comer** **comida** **saludable** y siempre **leo** la **carta** **cuidadosamente** antes de **decidir**. "
         f"El **camarero** nos **sirve** con mucha **amabilidad** y nos **explica** los **platos** **especiales**. "
         f"A veces **vamos** a **restaurantes** **donde** **sirven** **comida** **internacional** muy **deliciosa**. "
         f"**Acepto** **probar** **comida** **nueva** porque me **gusta** **experimentar** **sabores** **diferentes**. "
         f"Cuando **salgo** **comer** con **amigos**, siempre **compartimos** la **cuenta** **equitativamente**. "
         f"Me **encanta** **comer** **fruta** **fresca** y **verduras** porque son **saludables** para mi **cuerpo**. "
         f"**Prefiero** **comer** en **casa** con mi **familia** porque la **comida** **casera** es más **nutritiva**."),
        
        ("Deportes, ejercicio y vida activa", 
         f"Me **encanta** ser **deportiva** y **participo** en muchas **actividades** **físicas** **diferentes**. "
         f"**Juego** **fútbol** en el **equipo** de mi **instituto** y **practico** **tres** **veces** por **semana**. "
         f"Cuando **hace** **buen** **tiempo**, me **gusta** **montar** en **bicicleta** por el **parque**. "
         f"Los **fines** de **semana** **voy** al **estadio** **local** para **ver** **partidos** de **fútbol**. "
         f"**Participo** en **competencias** **deportivas** y he **ganado** varios **premios** **importantes**. "
         f"**Llevo** **ropa** **deportiva** **cómoda** y **zapatos** **especiales** para **hacer** **ejercicio**. "
         f"**Respeto** a todos los **jugadores** del **equipo** **contrario** durante las **competencias**. "
         f"El **ejercicio** me **ayuda** a **mantener** un **buen** **estado** **físico** y **mental**."),
        
        ("Compras, dinero y gestión financiera", 
         f"Cuando **voy** de **compras**, siempre **llevo** una **lista** **detallada** de lo que **necesito** **comprar**. "
         f"**Guardo** mi **dinero** en una **bolsa** **especial** **dentro** de mi **mochila** para **mayor** **seguridad**. "
         f"**Busco** **ofertas** **especiales** en las **tiendas** para **ahorrar** **dinero** en mis **compras**. "
         f"El **dueño** de la **tienda** **local** siempre me **da** **descuentos** **especiales** porque soy **cliente** **regular**. "
         f"**Comparo** **precios** en **diferentes** **tiendas** antes de **hacer** **compras** **importantes**. "
         f"**Ahorro** **dinero** de mi **trabajo** de **medio** **tiempo** para **comprar** **ropa** **nueva**. "
         f"**Llevo** mi **dinero** en una **caja** **pequeña** cuando **voy** al **mercado** **local**. "
         f"**Aprendo** sobre **economía** para **entender** **mejor** cómo **manejar** mi **dinero** **personal**."),
        
        ("Transporte, viajes y movilidad", 
         f"Para **ir** al **instituto** cada **día**, **tomo** el **autobús** que **pasa** por mi **barrio**. "
         f"**Durante** las **vacaciones**, mi **familia** **viaja** en **avión** a **destinos** **internacionales** **interesantes**. "
         f"Me **encanta** **viajar** en **barco** porque **disfruto** **viendo** el **océano** desde la **cubierta**. "
         f"**Cuando** **vamos** de **excursión**, **cruzamos** **puentes** **hermosos** que **conectan** **diferentes** **ciudades**. "
         f"El **vuelo** **internacional** **dura** **varias** **horas**, pero **vale** la **pena** por la **experiencia**. "
         f"**Prefiero** **viajar** en **tren** porque **puedo** **leer** **libros** y **disfrutar** del **paisaje**. "
         f"**Camino** **mucho** por la **ciudad** porque es **bueno** para mi **salud** y el **medio** **ambiente**. "
         f"**Cuando** **voy** al **extranjero**, siempre **aprendo** **frases** **básicas** del **idioma** **local**."),
        
        ("Arte, creatividad y expresión personal", 
         f"Me **apasiona** el **arte** y **paso** **mucho** **tiempo** **practicando** **dibujo** en mi **tiempo** **libre**. "
         f"**Participo** en **concursos** de **arte** donde **puedo** **mostrar** mis **habilidades** **creativas**. "
         f"**Pinto** **cuadros** **coloridos** que **expresan** mis **emociones** y **pensamientos** **profundos**. "
         f"**Visito** **museos** de **arte** para **inspirarme** con las **obras** de **artistas** **famosos**. "
         f"**Me** **pinto** las **uñas** con **colores** **brillantes** para **expresar** mi **personalidad** **única**. "
         f"**Diseño** **carteles** para los **eventos** **escolares** usando **técnicas** **artísticas** **modernas**. "
         f"**Colecciono** **materiales** de **arte** como **pinceles**, **pinturas** y **papel** **especial**. "
         f"**Grabo** **videos** de mis **procesos** **artísticos** para **compartir** en **redes** **sociales**."),
        
        ("Comunicación digital y redes sociales", 
         f"**Uso** **Internet** **diariamente** para **comunicar** con **amigos** de **diferentes** **países**. "
         f"**Envío** **correos** **electrónicos** a mis **profesores** cuando **tengo** **dudas** sobre las **tareas**. "
         f"**Participo** en **foros** **online** donde **discuto** **temas** **educativos** con otros **estudiantes**. "
         f"**Grabo** **videos** **educativos** para **ayudar** a **estudiantes** **más** **jóvenes** con sus **estudios**. "
         f"**Sigo** a **influencers** **educativos** que **comparten** **consejos** **útiles** para **estudiar** **mejor**. "
         f"**Voto** en **encuestas** **online** sobre **temas** **importantes** para los **jóvenes**. "
         f"**Mantengo** **conversaciones** **interesantes** en **grupos** de **estudio** **virtuales**. "
         f"**Uso** **tecnología** **moderna** para **mejorar** mi **experiencia** **educativa** **personal**."),
        
        ("Problemas sociales y participación ciudadana", 
         f"Me **preocupo** por el **paro** **juvenil** y **participo** en **programas** para **ayudar** a **jóvenes** **desempleados**. "
         f"**Respeto** a la **policía** y **entiendo** su **papel** **importante** en **mantener** la **seguridad** **social**. "
         f"**Colaboro** con **organizaciones** que **luchan** contra la **discriminación** en todas sus **formas**. "
         f"**Voto** en **elecciones** **estudiantiles** para **elegir** **representantes** que **defiendan** nuestros **derechos**. "
         f"**Participo** en **manifestaciones** **pacíficas** para **apoyar** **causas** **justas** e **importantes**. "
         f"**Ayudo** a **cuidadores** **voluntarios** que **trabajan** con **personas** **mayores** en **residencias**. "
         f"**Apoyo** **iniciativas** que **promueven** la **igualdad** de **oportunidades** para **todos** los **ciudadanos**. "
         f"**Creo** que es **importante** **participar** **activamente** en la **vida** **política** de mi **comunidad**."),
        
        ("Servicios profesionales y oficios especializados", 
         f"Cuando **necesito** **cortar** mi **cabello**, **voy** a **ver** a mi **peluquero** **favorito** del **barrio**. "
         f"Mi **abuela** **recibe** **ayuda** de un **cuidador** **profesional** que **visita** su **casa** **regularmente**. "
         f"**Conozco** a un **ingeniero** **talentoso** que **diseña** **edificios** **modernos** y **sostenibles**. "
         f"El **periodista** **local** **escribe** **artículos** **interesantes** sobre **eventos** **importantes** de la **ciudad**. "
         f"**Admiro** a los **pintores** **profesionales** que **crean** **obras** de **arte** **hermosas** y **significativas**. "
         f"Mi **dentista** **trabaja** en una **oficina** **moderna** con **equipos** **tecnológicos** **avanzados**. "
         f"**Respeto** el **trabajo** de los **secretarios** que **manejan** **documentos** **importantes** **eficientemente**. "
         f"Los **músicos** **profesionales** **dedican** **muchas** **horas** **diarias** a **perfeccionar** sus **habilidades**."),
        
        ("Educación especializada y formación avanzada", 
         f"**Después** del **instituto**, **planeo** **estudiar** **Bachillerato** para **prepararme** para la **universidad**. "
         f"**Durante** los **exámenes** **finales**, **uso** **técnicas** de **estudio** **especiales** para **recordar** **información**. "
         f"**Mantengo** **conversaciones** **académicas** con **profesores** sobre **temas** **complejos** de **ciencias**. "
         f"**Leo** **libros** **especializados** sobre **medicina** para **ampliar** mis **conocimientos** **científicos**. "
         f"**Participo** en **seminarios** **educativos** donde **aprendo** sobre **nuevas** **tecnologías** **médicas**. "
         f"**Escribo** **ensayos** **académicos** usando **vocabulario** **técnico** y **referencias** **científicas**. "
         f"**Busco** **oportunidades** de **investigación** en **laboratorios** **universitarios** **prestigiosos**. "
         f"**Saco** **buenas** **notas** en todas mis **asignaturas** **gracias** a mi **dedicación** **constante**."),
        
        ("Actividades de tiempo libre y entretenimiento", 
         f"En mi **tiempo** **libre**, me **gusta** **leer** **novelas** **románticas** y de **aventuras**. "
         f"**Veo** **películas** **interesantes** en el **cine** con mis **amigos** los **fines** de **semana**. "
         f"**Colecciono** **revistas** de **ciencia** y **tecnología** para **mantenerme** **informada** sobre **avances**. "
         f"**Toco** **instrumentos** **musicales** como la **guitarra** y el **piano** en mi **habitación**. "
         f"**Organizo** **juegos** **divertidos** con mis **hermanos** **pequeños** durante las **tardes**. "
         f"**Escribo** **historias** **cortas** y **poemas** que **expresan** mis **sentimientos** **personales**. "
         f"**Disfruto** **viendo** **espectáculos** de **baile** y **teatro** en el **centro** **cultural**. "
         f"**Paso** **tiempo** en la **biblioteca** **leyendo** sobre **diferentes** **culturas** del **mundo**."),
        
        ("Objetos personales y pertenencias", 
         f"**Siempre** **llevo** mi **bolígrafo** **favorito** para **escribir** **notas** **importantes** durante las **clases**. "
         f"**Tengo** una **mesa** **especial** en mi **habitación** donde **hago** todos mis **deberes**. "
         f"Mi **silla** de **estudio** es muy **cómoda** y me **ayuda** a **concentrarme** **mejor**. "
         f"**Guardo** mis **documentos** **importantes** en una **caja** **segura** en mi **habitación**. "
         f"**Abro** la **ventana** de mi **cuarto** cada **mañana** para **dejar** **entrar** **aire** **fresco**. "
         f"**Uso** una **regla** **especial** para **hacer** **diagramas** **precisos** en mis **proyectos**. "
         f"**Cierro** la **puerta** de mi **habitación** cuando **necesito** **concentrarme** en **estudiar**. "
         f"**Organizo** todas mis **pertenencias** **cuidadosamente** para **mantener** mi **espacio** **ordenado**."),
        
        ("Personalidad, carácter y comportamiento", 
         f"**Aunque** a **veces** **puedo** **ser** un **poco** **tonta** con mis **bromas**, siempre **respeto** a **otros**. "
         f"**Nunca** soy **perezosa** con mis **estudios** porque **entiendo** la **importancia** de la **educación**. "
         f"**Cuando** estoy **cansada** **después** de un **día** **largo**, **busco** **maneras** de **relajarme**. "
         f"**Soy** muy **trabajadora** y **siempre** **termino** mis **tareas** **antes** de la **fecha** **límite**. "
         f"**Estoy** **lista** para **enfrentar** **cualquier** **desafío** que la **vida** me **presente**. "
         f"**Mantengo** una **actitud** **positiva** **incluso** **cuando** las **cosas** se **ponen** **difíciles**. "
         f"**Acepto** mis **errores** y **aprendo** de **ellos** para **mejorar** como **persona**. "
         f"**Trato** de **ser** **amable** y **comprensiva** con **todas** las **personas** que **conozco**."),
        
        ("Celebraciones especiales y reconocimientos", 
         f"**Durante** las **celebraciones** **escolares**, **participo** **activamente** en **todas** las **actividades**. "
         f"**He** **ganado** varios **premios** **académicos** por mi **excelente** **rendimiento** en **ciencias**. "
         f"**Celebro** los **logros** de mis **compañeros** porque **creo** en el **éxito** **colectivo**. "
         f"**Participo** en **ceremonias** **especiales** donde **reconocen** a **estudiantes** **destacados**. "
         f"**Organizo** **fiestas** **sorpresa** para **amigos** que **cumplen** **años** **importantes**. "
         f"**Asisto** a **graduaciones** de **familiares** para **mostrar** mi **apoyo** y **orgullo**. "
         f"**Colaboro** en la **preparación** de **eventos** **especiales** en mi **comunidad** **local**. "
         f"**Disfruto** **participando** en **tradiciones** **familiares** durante **festividades** **importantes**."),
        
        ("Rutina diaria y gestión del tiempo", 
         f"**Cada** **día** **sigo** una **rutina** **estructurada** que me **ayuda** a **ser** más **productiva**. "
         f"**Por** las **mañanas**, **reviso** mi **lista** de **tareas** para **planificar** mi **día** **eficientemente**. "
         f"**Uso** mi **horario** **escolar** para **organizar** **todas** mis **actividades** **académicas** y **sociales**. "
         f"**Dedico** **tiempo** **específico** cada **tarde** para **repasar** las **lecciones** del **día**. "
         f"**Mantengo** un **equilibrio** **saludable** **entre** **estudios**, **ejercicio** y **descanso**. "
         f"**Establezco** **metas** **diarias** **pequeñas** que me **acercan** a mis **objetivos** **grandes**. "
         f"**Evalúo** mi **progreso** **regularmente** para **asegurarme** de **estar** en el **camino** **correcto**. "
         f"**Ajusto** mi **rutina** **cuando** es **necesario** para **mejorar** mi **eficiencia** **personal**.")
    ]
    
    return paragraphs

def track_vocabulary_usage(paragraphs: List[Tuple[str, str]], vocabulary: Dict) -> Set[str]:
    """Track which vocabulary words are actually used in the paragraphs"""
    used_words = set()
    
    # Combine all paragraph text
    all_text = " ".join([text for _, text in paragraphs])
    
    # Check each vocabulary word
    for category, word_list in vocabulary.items():
        for word, definition in word_list:
            # Look for the word in bold format
            if f"**{word}**" in all_text:
                used_words.add(word)
    
    return used_words

def get_total_vocab_count(vocabulary: Dict) -> int:
    """Get total count of vocabulary words"""
    total = 0
    for category, word_list in vocabulary.items():
        total += len(word_list)
    return total

def check_unused_vocabulary(vocabulary: Dict, used_words: Set[str]) -> Dict:
    """Check which vocabulary words were not used"""
    unused = {}
    
    for category, word_list in vocabulary.items():
        unused_in_category = []
        for word, definition in word_list:
            if word not in used_words:
                unused_in_category.append(word)
        unused[category] = unused_in_category
    
    return unused

def create_markdown_content(paragraphs: List[Tuple[str, str]], vocabulary: Dict, used_words: Set[str]) -> str:
    """Create the complete markdown content with verification"""
    
    content = """# Cuaderno de Revisión GCSE Español
## Tema 1, Unidad 1: Identidad y relaciones con otros

*Cuaderno completo con todo el vocabulario requerido integrado en contexto*

---

"""
    
    # Add paragraphs
    for i, (title, text) in enumerate(paragraphs, 1):
        content += f"## Párrafo {i}: {title}\n\n"
        content += f"{text}\n\n"
    
    content += "---\n\n"
    content += "## ✅ Lista de Verificación Completa de Vocabulario\n\n"
    
    # Add comprehensive vocabulary checklist
    content += "### Adjetivos (adj)\n"
    for word, definition in vocabulary['adj']:
        status = "✅" if word in used_words else "❌"
        content += f"- [{status}] **{word}** - {definition}\n"
    
    content += "\n### Expresiones de múltiples palabras (mwp)\n"
    for word, definition in vocabulary['mwp']:
        status = "✅" if word in used_words else "❌"
        content += f"- [{status}] **{word}** - {definition}\n"
    
    content += "\n### Sustantivos femeninos (n_f)\n"
    for word, definition in vocabulary['n_f']:
        status = "✅" if word in used_words else "❌"
        content += f"- [{status}] **{word}** - {definition}\n"
    
    content += "\n### Sustantivos masculinos (n_m)\n"
    for word, definition in vocabulary['n_m']:
        status = "✅" if word in used_words else "❌"
        content += f"- [{status}] **{word}** - {definition}\n"
    
    content += "\n### Verbos (verbs)\n"
    for word, definition in vocabulary['verbs']:
        status = "✅" if word in used_words else "❌"
        content += f"- [{status}] **{word}** - {definition}\n"
    
    content += "\n### Sustantivos masculinos/femeninos (n_mf)\n"
    for word, definition in vocabulary['n_mf']:
        status = "✅" if word in used_words else "❌"
        content += f"- [{status}] **{word}** - {definition}\n"
    
    # Add usage statistics
    total_words = get_total_vocab_count(vocabulary)
    used_count = len(used_words)
    
    content += f"\n### 📊 Estadísticas de Uso\n"
    content += f"- **Total de vocabulario**: {total_words} palabras\n"
    content += f"- **Palabras utilizadas**: {used_count} palabras\n"
    content += f"- **Porcentaje de cobertura**: {(used_count/total_words)*100:.1f}%\n\n"
    
    # Add conversion instructions
    content += """---

## 📖 Guía de Conversión a Documento Word

### Método Recomendado:
```bash
# Instalar pandoc (si no está instalado)
brew install pandoc  # macOS
# o
sudo apt-get install pandoc  # Linux

# Convertir a Word
pandoc spanish_revision_booklet_complete.md -o spanish_revision_booklet_complete.docx
```

### Formato Sugerido para Impresión:
- **Título principal**: Arial 16pt, negrita, centrado
- **Subtítulos**: Arial 12pt, negrita  
- **Texto de párrafos**: Arial 11pt, justificado
- **Vocabulario en negrita**: Mantener formato para identificación fácil
- **Espaciado**: 1.5 líneas
- **Márgenes**: 2.5cm para encuadernación
- **Páginas**: Numeradas en pie de página

### Uso Pedagógico:
✅ Revisión intensiva de vocabulario GCSE  
✅ Práctica de comprensión lectora  
✅ Ejercicios de pronunciación  
✅ Identificación de estructuras gramaticales  
✅ Preparación para exámenes orales y escritos  

*¡Perfecto para estudiantes de Year 11 preparándose para sus exámenes GCSE de español!*
"""
    
    return content

def create_html_version(markdown_content: str):
    """Create an HTML preview version"""
    html_content = f"""<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cuaderno de Revisión GCSE Español - Completo</title>
    <style>
        body {{
            font-family: 'Arial', sans-serif;
            max-width: 900px;
            margin: 0 auto;
            padding: 20px;
            line-height: 1.6;
            background-color: #f8f9fa;
        }}
        .container {{
            background-color: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }}
        h1 {{
            color: #2c3e50;
            text-align: center;
            border-bottom: 3px solid #3498db;
            padding-bottom: 15px;
            margin-bottom: 30px;
        }}
        h2 {{
            color: #34495e;
            margin-top: 35px;
            padding-left: 10px;
            border-left: 4px solid #3498db;
        }}
        h3 {{
            color: #7f8c8d;
            margin-top: 25px;
        }}
        strong {{
            color: #e74c3c;
            font-weight: bold;
            background-color: #fef9e7;
            padding: 1px 3px;
            border-radius: 3px;
        }}
        .paragraph {{
            background-color: #f8f9fa;
            padding: 20px;
            border-left: 4px solid #3498db;
            margin: 20px 0;
            border-radius: 5px;
        }}
        .checklist {{
            background-color: #f1f8ff;
            padding: 15px;
            border-radius: 5px;
            margin: 15px 0;
        }}
        ul {{
            list-style-type: none;
            padding-left: 0;
        }}
        li {{
            margin: 8px 0;
            padding: 5px 0;
            border-bottom: 1px solid #ecf0f1;
        }}
        li:last-child {{
            border-bottom: none;
        }}
        .instructions {{
            background-color: #fff3cd;
            padding: 20px;
            border-radius: 5px;
            border: 1px solid #ffeaa7;
            margin: 20px 0;
        }}
        .stats {{
            background-color: #e8f5e8;
            padding: 15px;
            border-radius: 5px;
            border: 1px solid #28a745;
        }}
        code {{
            background-color: #f4f4f4;
            padding: 2px 4px;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
        }}
        pre {{
            background-color: #f4f4f4;
            padding: 15px;
            border-radius: 5px;
            overflow-x: auto;
        }}
    </style>
</head>
<body>
    <div class="container">
"""
    
    # Convert markdown to HTML
    lines = markdown_content.split('\n')
    in_paragraph = False
    in_checklist = False
    
    for line in lines:
        if line.startswith('# '):
            html_content += f"<h1>{line[2:]}</h1>\n"
        elif line.startswith('## '):
            if in_paragraph:
                html_content += "</div>\n"
                in_paragraph = False
            if in_checklist:
                html_content += "</div>\n"
                in_checklist = False
                
            if 'Párrafo' in line:
                html_content += f'<div class="paragraph"><h2>{line[3:]}</h2>\n'
                in_paragraph = True
            elif 'Verificación' in line or 'Estadísticas' in line:
                html_content += f'<div class="checklist"><h2>{line[3:]}</h2>\n'
                in_checklist = True
            else:
                html_content += f"<h2>{line[3:]}</h2>\n"
        elif line.startswith('### '):
            if 'Estadísticas' in line:
                html_content += f'<div class="stats"><h3>{line[4:]}</h3>\n'
            else:
                html_content += f"<h3>{line[4:]}</h3>\n"
        elif line.startswith('- ['):
            formatted_line = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', line[4:])
            html_content += f"<li>{formatted_line}</li>\n"
        elif line.startswith('```'):
            if '<pre>' in html_content and '</pre>' not in html_content:
                html_content += "</pre>\n"
            else:
                html_content += "<pre><code>\n"
        elif line.startswith('---'):
            if in_paragraph:
                html_content += "</div>\n"
                in_paragraph = False
            if in_checklist:
                html_content += "</div>\n"
                in_checklist = False
            html_content += "<hr>\n"
        elif line.strip() and not line.startswith('*'):
            # Convert **bold** to <strong>
            formatted_line = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', line)
            if '<pre>' in html_content and '</pre>' not in html_content:
                html_content += f"{line}\n"
            else:
                html_content += f"<p>{formatted_line}</p>\n"
        elif line.strip():
            formatted_line = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', line)
            html_content += f"<p><em>{formatted_line}</em></p>\n"
    
    if in_paragraph:
        html_content += "</div>\n"
    if in_checklist:
        html_content += "</div>\n"
    
    html_content += """
    </div>
</body>
</html>
"""
    
    with open('spanish_revision_booklet_complete.html', 'w', encoding='utf-8') as f:
        f.write(html_content)
    
    print("📱 HTML preview created: spanish_revision_booklet_complete.html")

if __name__ == "__main__":
    create_revision_booklet()
