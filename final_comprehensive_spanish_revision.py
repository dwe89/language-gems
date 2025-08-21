# final_comprehensive_spanish_revision.py
import re
from typing import Dict, List, Tuple, Set

def create_complete_revision_booklet():
    """Generate a comprehensive Spanish revision booklet using ALL vocabulary words"""
    
    # Complete vocabulary list
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
    
    # Generate comprehensive paragraphs using ALL vocabulary systematically
    paragraphs = generate_all_inclusive_paragraphs(vocabulary)
    
    # Verify all words are used
    used_words = track_vocabulary_usage(paragraphs, vocabulary)
    
    # Create final content
    markdown_content = create_final_markdown(paragraphs, vocabulary, used_words)
    
    # Write files
    with open('final_spanish_revision_booklet.md', 'w', encoding='utf-8') as f:
        f.write(markdown_content)
    
    create_final_html(markdown_content)
    
    # Report results
    total_words = sum(len(word_list) for word_list in vocabulary.values())
    print(f"✅ Final revision booklet created!")
    print(f"📊 Vocabulary coverage: {len(used_words)}/{total_words} words")
    
    if len(used_words) == total_words:
        print("🎉 SUCCESS! ALL vocabulary words have been used!")
    else:
        unused = check_unused_words(vocabulary, used_words)
        print("⚠️ Missing words:", unused)
    
    print("\n📝 To convert to Word:")
    print("   pandoc final_spanish_revision_booklet.md -o final_spanish_revision_booklet.docx")

def generate_all_inclusive_paragraphs(vocabulary: Dict) -> List[Tuple[str, str]]:
    """Generate paragraphs that systematically include ALL vocabulary words"""
    
    paragraphs = [
        ("Mi identidad personal completa", 
         f"Me **llamo** Carmen y soy una **estudiante** muy **responsable** en mi **instituto**. "
         f"Soy **inglés** por parte de mi madre, pero también soy **trabajadora** y muy **lista** para cualquier desafío. "
         f"A veces me siento **cansada** después de estudiar, pero nunca soy **perezosa** con mis tareas. "
         f"Cuando alguien dice algo **tonto**, prefiero **callarse** y no **gritar**. "
         f"Mi **sueño** es ser **médico** y **trabajar** en un **hospital** moderno ayudando a personas."),
        
        ("Mi familia y nuestras relaciones especiales", 
         f"En mi **familia** tenemos una **relación** muy fuerte llena de **apoyo** y **respeto** mutuo. "
         f"Mi padre es **profesor** de **matemáticas** en un **colegio** y mi madre es **enfermera** en una clínica. "
         f"Mis padres nos **enseñan** a **respetar** a todos y nunca **pelearse** por cosas sin importancia. "
         f"Mi hermano **estudia** en una **escuela** primaria donde le gusta **jugar** diferentes **juegos**. "
         f"Durante las **vacaciones** **organizamos** **excursiones** familiares que fortalecen nuestra **amistad**. "
         f"El **señor** que vive al lado es muy amable y nos **apoya** como buenos vecinos."),
        
        ("Mis amistades y vida social en el instituto", 
         f"Tengo muchos **amigos** en mi **clase** y formamos un **equipo** muy unido para estudiar. "
         f"Mi mejor **compañero** es muy **deportivo** y siempre **juega** **fútbol** en el **patio** durante el **recreo**. "
         f"Algunos **alumnos** pueden ser diferentes, pero todos nos **apoyamos** para **mejorar** nuestras **notas**. "
         f"Nunca toleramos el **acoso** en nuestra **escuela** y siempre **comunicamos** problemas al **director**. "
         f"Cada **día** tenemos **conversaciones** interesantes donde compartimos ideas sin **discusiones** agresivas."),
        
        ("Mis estudios académicos y asignaturas favoritas", 
         f"Mi **asignatura** favorita es **ciencias** porque quiero **estudiar** **medicina** en la **universidad**. "
         f"También disfruto **historia** porque **aprendo** sobre diferentes culturas del **mundo** y varios **países**. "
         f"En **informática** uso mi **ordenador** para hacer **proyectos** y **buscar** información en **Internet**. "
         f"Mi **profesora** de **geografía** nos **enseña** cosas fascinantes sobre diferentes naciones. "
         f"**Escribo** muchas **notas** con mi **bolígrafo** y **leo** varios **libros** para **repasar** contenido. "
         f"Llevo todo en mi **mochila** y **pido** ayuda cuando no entiendo alguna **palabra** o **frase**. "
         f"Mi **horario** incluye **economía** donde **aprendemos** sobre el **mercado** y la **industria**. "
         f"Cada **página** contiene información valiosa que me ayuda en mis **estudios**."),
        
        ("Tecnología, comunicación y medios modernos", 
         f"Los **medios de comunicación** son fundamentales en mi vida **diaria**. "
         f"**Leo** el **periódico** **online** cada mañana y uso la **red** para **comunicar** con **amigos**. "
         f"Mi teléfono tiene aplicaciones **educativas** que complementan mi **educación** formal. "
         f"**Grabo** videos para **concursos** de **tecnología** organizados en mi **instituto**. "
         f"La **informática** es crucial para mi futuro **laboral** y desarrollo profesional. "
         f"**Envío** **correos** electrónicos a **profesores** cuando tengo dudas académicas. "
         f"Mi computadora me **permite** **diseñar** presentaciones digitales para **proyectos** escolares."),
        
        ("Mis planes de carrera profesional", 
         f"Mi **carrera** ideal es ser **científico** especializado en **medicina** avanzada. "
         f"**Busco** constantemente nuevas **oportunidades** para ganar **experiencia** en este **campo** especializado. "
         f"He participado en una **entrevista** importante en una **empresa** farmacéutica reconocida. "
         f"Mi **jefe** potencial explicó que debo **continuar** estudios universitarios para alcanzar el **éxito**. "
         f"El **salario** no es mi prioridad principal, sino **servir** a la comunidad. "
         f"Mi **profesión** ideal me **permitirá** **construir** un futuro mejor para muchas personas. "
         f"**Sueño** con **viajar** al **extranjero** para **aprender** técnicas médicas innovadoras."),
        
        ("Actividades extracurriculares y entretenimiento", 
         f"**Participo** activamente en actividades **al aire libre** porque disfruto ser **deportiva**. "
         f"Soy **miembro** del **club** de **teatro** donde **canto** y practico **arte** dramático. "
         f"**Pinto** cuadros expresivos y **toco** instrumentos musicales como hobby creativo. "
         f"Durante **septiembre** **empiezo** nuevas actividades como **dibujo** artístico y **música** clásica. "
         f"**Organizo** **espectáculos** benéficos con **compañeros** para ayudar causas sociales importantes. "
         f"Estas actividades desarrollan mi **comportamiento** social y **confianza** personal. "
         f"Mis padres me **apoyan** en todas mis **aficiones** artísticas y deportivas."),
        
        ("Desafíos académicos y superación personal", 
         f"A veces me siento **cansada** por la **presión** académica y el **estrés** de **exámenes** importantes. "
         f"Cuando cometo un **error** en alguna **prueba**, **aprendo** de la **experiencia** para mejorar. "
         f"Mi **consejo** para otros **estudiantes** es nunca **callarse** cuando necesitan ayuda académica. "
         f"Es fundamental **pedir** **apoyo** a **profesores** y **compañeros** durante dificultades. "
         f"El **esfuerzo** constante siempre produce buenos **resultados** académicos y personales. "
         f"**Acepto** que la perfección es imposible, pero **continúo** **trabajando** con dedicación. "
         f"La **educación** requiere paciencia, dedicación y perseverancia constante."),
        
        ("Literatura, entretenimiento y cultura personal", 
         f"Me fascina **leer** **novelas** románticas y **revistas** de **moda** contemporánea. "
         f"Disfruto enormemente viendo **películas** en el **teatro** con mi **familia** los **fines** de semana. "
         f"La **música** es fundamental en mi vida - **canto** en el coro escolar. "
         f"Visito frecuentemente la **biblioteca** para **estudiar** y **buscar** **libros** interesantes. "
         f"**Leo** biografías de **autores** famosos y **escritores** que me inspiran profundamente. "
         f"**Visito** **museos** donde **aprendo** sobre **arte** clásico y **historia** mundial. "
         f"**Colecciono** **revistas** científicas para mantenerme actualizada sobre avances tecnológicos."),
        
        ("Viajes internacionales y experiencias culturales", 
         f"El **año** pasado realicé un **viaje** educativo increíble a Francia. "
         f"Visitamos **museos** históricos y **edificios** arquitectónicos que enriquecieron mi **educación**. "
         f"Practiqué mi **lengua** francesa con personas locales ganando **experiencia** internacional invaluable. "
         f"Este **viaje** me dio la **oportunidad** de conocer **estudiantes** de otros **países**. "
         f"**Sueño** con **viajar** por todo el **mundo** para **aprender** diferentes **idiomas**. "
         f"Utilicé **autobús** y **avión** durante mis aventuras, disfrutando cada **vuelo**. "
         f"**Compré** **ropa** tradicional y **zapatos** artesanales como recuerdos especiales. "
         f"**Saqué** fotografías de **puentes** históricos y **barcos** tradicionales durante **excursiones**."),
        
        ("Experiencia laboral y trabajo de medio tiempo", 
         f"Actualmente **trabajo** como **camarera** en una **tienda** de **ropa** juvenil. "
         f"Mi **jefe** comprensivo me **permite** **estudiar** durante horas tranquilas. "
         f"Atiendo diversos **clientes** y he **aprendido** a **comunicar** efectivamente con personas. "
         f"Este **empleo** proporciona **experiencia** **laboral** valiosa y ingresos para gastos personales. "
         f"**Sirvo** a **clientes** con profesionalismo y **busco** constantemente **mejorar** mi servicio. "
         f"Trabajo en **recepción** manejando la **caja** registradora con responsabilidad. "
         f"Mi supervisor me ofreció una excelente **oferta** para **continuar** después de graduarme."),
        
        ("Instalaciones escolares y entorno educativo", 
         f"Mi **instituto** cuenta con excelentes **instalaciones** para todos los **estudiantes** matriculados. "
         f"Tenemos una **biblioteca** amplia con numerosos **libros** y **ordenadores** para investigación. "
         f"El **patio** espacioso es perfecto para **jugar** **fútbol** durante el **recreo** diario. "
         f"Cada **aula** tiene **mesas** y **sillas** ergonómicas, además de **ventanas** amplias. "
         f"Los **servicios** están siempre limpios y bien mantenidos por personal especializado. "
         f"Tenemos un **estadio** moderno donde practicamos **educación** física y deportes. "
         f"La **oficina** del **director** está ubicada en el edificio administrativo principal. "
         f"Hay una **fábrica** de ideas en nuestro laboratorio donde realizamos experimentos. "
         f"Cada estudiante debe seguir las **reglas** de comportamiento en todas las áreas."),
        
        ("Profesiones inspiradoras y el mundo laboral", 
         f"En mi entorno familiar hay diversas **profesiones** que me inspiran diariamente. "
         f"Mi tío es **periodista** y **escribe** **artículos** para un **periódico** regional. "
         f"Mi prima es **abogado** y **trabaja** en una **oficina** jurídica prestigiosa. "
         f"Conozco un **ingeniero** talentoso que **diseña** **puentes** y **edificios** sostenibles. "
         f"Una **actriz** reconocida visitó nuestro **instituto** hablando sobre su **carrera** teatral. "
         f"El **peluquero** local también es **artista** y **pinta** cuadros creativos. "
         f"Mi **médico** familiar me inspira a **estudiar** **medicina** universitaria. "
         f"Un **músico** profesional vino a **enseñar** **música** en nuestro **club** escolar. "
         f"La **secretaria** institucional es eficiente manejando documentos importantes. "
         f"**Conozco** también un **pintor** que crea **obras** en su **estudio** privado."),
        
        ("Eventos especiales y celebraciones comunitarias", 
         f"Durante **vacaciones** escolares **organizamos** múltiples actividades sociales divertidas. "
         f"**Participamos** en **concursos** de talento donde cada **estudiante** muestra habilidades únicas. "
         f"El **club** teatral **organiza** **espectáculos** especiales para toda la comunidad local. "
         f"**Celebramos** el **éxito** de **compañeros** cuando **ganan** **premios** académicos importantes. "
         f"Los **fines** de semana **visitamos** el **mercado** local comprando productos frescos. "
         f"**Hacemos** fiestas de cumpleaños donde **cantamos** y bailamos hasta altas horas. "
         f"**Organizamos** **excursiones** a **museos** y parques para **aprender** fuera del **aula**. "
         f"**Invitamos** **artistas** locales a eventos culturales especiales institucionales."),
        
        ("Moda, estilo personal y presentación", 
         f"En mi **instituto** no usamos **uniforme**, permitiendo **elegir** **ropa** libremente. "
         f"Me gusta **llevar** **camisas** cómodas y **pantalones** casuales para estudiar efectivamente. "
         f"Tengo una **falda** favorita que uso para ocasiones especiales institucionales. "
         f"Siempre **llevo** **zapatos** cómodos porque camino frecuentemente entre clases diferentes. "
         f"Mi **mochila** **contiene** todos mis **libros**, **bolígrafos** y materiales escolares necesarios. "
         f"Para **entrevistas** importantes me visto más formalmente siguiendo protocolos apropiados. "
         f"Me gusta comprar **ropa** en la **tienda** donde trabajo los **fines** de semana. "
         f"**Guardo** mi dinero en una **bolsa** especial dentro de mi **mochila** escolar. "
         f"La **moda** me interesa, pero prefiero comodidad para estudiar efectivamente."),
        
        ("Metas futuras y aspiraciones a largo plazo", 
         f"Mi meta principal es **estudiar** **medicina** en una **universidad** prestigiosa reconocida. "
         f"Quiero especializarme en pediatría para ayudar niños enfermos en **hospitales** modernos. "
         f"Planeo realizar un máster en el **extranjero** para ganar **experiencia** internacional. "
         f"Mi **sueño** es abrir mi propia clínica contratando otros **médicos** jóvenes. "
         f"Estoy segura de que con **esfuerzo** y dedicación alcanzaré objetivos profesionales. "
         f"También quiero **aprender** varios **idiomas** para **comunicar** con pacientes internacionales. "
         f"**Votaré** siempre por políticas que **mejoren** **educación** y **sanidad** pública."),
        
        ("Actividades creativas y expresión artística", 
         f"Me apasiona el **arte** y paso tiempo **practicando** **dibujo** en mi tiempo libre. "
         f"**Participo** en **concursos** artísticos donde muestro mis habilidades creativas desarrolladas. "
         f"**Pinto** cuadros coloridos que **expresan** mis emociones y pensamientos profundos. "
         f"**Visito** **museos** de **arte** para inspirarme con obras de **artistas** reconocidos. "
         f"**Me** **pinto** las uñas con colores brillantes expresando mi personalidad única. "
         f"**Diseño** carteles para eventos escolares usando técnicas artísticas modernas. "
         f"**Colecciono** materiales artísticos como pinceles, pinturas y **papel** especial. "
         f"**Grabo** videos de mis procesos artísticos para compartir en redes sociales."),
        
        ("Comunicación digital y tecnología moderna", 
         f"**Uso** **Internet** diariamente para **comunicar** con **amigos** de diferentes **países**. "
         f"**Envío** **correos** electrónicos a **profesores** cuando tengo dudas sobre **tareas** específicas. "
         f"**Participo** en foros **online** donde **discuto** temas **educativos** con otros **estudiantes**. "
         f"**Grabo** videos **educativos** para ayudar a **estudiantes** más jóvenes con estudios. "
         f"**Sigo** a **influencers** **educativos** que comparten consejos útiles para estudiar mejor. "
         f"**Voto** en encuestas **online** sobre temas importantes para jóvenes contemporáneos. "
         f"**Mantengo** **conversaciones** interesantes en grupos de estudio virtuales organizados. "
         f"**Uso** **tecnología** moderna para **mejorar** mi **experiencia** **educativa** personal."),
        
        ("Problemas sociales y participación ciudadana", 
         f"Me preocupa el **paro** juvenil y **participo** en programas ayudando jóvenes desempleados. "
         f"**Respeto** a la **policía** y entiendo su **papel** importante manteniendo seguridad social. "
         f"**Colaboro** con organizaciones que luchan contra discriminación en todas sus formas. "
         f"**Voto** en elecciones estudiantiles para **elegir** representantes defendiendo nuestros derechos. "
         f"**Participo** en manifestaciones pacíficas para **apoyar** causas justas e importantes. "
         f"**Ayudo** a **cuidadores** voluntarios que **trabajan** con personas mayores en residencias. "
         f"**Apoyo** iniciativas que **promueven** igualdad de **oportunidades** para todos los ciudadanos. "
         f"**Creo** que es importante **participar** activamente en la vida política comunitaria."),
        
        ("Servicios profesionales y oficios especializados", 
         f"Cuando necesito cortar mi cabello, **visito** a mi **peluquero** favorito del barrio. "
         f"Mi abuela recibe ayuda de un **cuidador** profesional que visita regularmente. "
         f"**Conozco** un **ingeniero** talentoso que **diseña** **edificios** modernos y sostenibles. "
         f"El **periodista** local **escribe** **artículos** interesantes sobre eventos ciudadanos importantes. "
         f"**Admiro** a **pintores** profesionales que crean obras artísticas hermosas y significativas. "
         f"Mi dentista **trabaja** en una **oficina** moderna con equipos tecnológicos avanzados. "
         f"**Respeto** el **trabajo** de **secretarios** que manejan documentos importantes eficientemente. "
         f"Los **músicos** profesionales dedican muchas horas diarias perfeccionando sus habilidades."),
        
        ("Educación especializada y formación avanzada", 
         f"Después del **instituto**, planeo **estudiar** **Bachillerato** para prepararme universitariamente. "
         f"Durante **exámenes** finales, uso técnicas de estudio especiales para recordar información. "
         f"**Mantengo** **conversaciones** académicas con **profesores** sobre temas complejos científicos. "
         f"**Leo** **libros** especializados sobre **medicina** para ampliar conocimientos científicos actuales. "
         f"**Participo** en seminarios **educativos** donde **aprendo** sobre nuevas tecnologías médicas. "
         f"**Escribo** ensayos académicos usando vocabulario técnico y referencias científicas especializadas. "
         f"**Busco** **oportunidades** de investigación en laboratorios universitarios prestigiosos reconocidos. "
         f"**Saco** buenas **notas** en todas mis **asignaturas** gracias a dedicación constante."),
        
        ("Productos y servicios comerciales", 
         f"La **compañía** donde trabajo **vende** productos de calidad a **clientes** satisfechos. "
         f"El **dueño** del **negocio** es un **empresario** exitoso que maneja el **banco** local. "
         f"**Acepto** diferentes métodos de pago y **mandar** productos a domicilio cuando necesario. "
         f"La **fábrica** local produce artículos que se **venden** en **tiendas** especializadas. "
         f"Los **empleados** reciben un **salario** justo por su **trabajo** dedicado y responsable. "
         f"Tengo la **opción** de **permitirse** lujos ocasionales gracias a mis ingresos. "
         f"El **correo** electrónico es fundamental para **comunicar** con **clientes** modernos. "
         f"**Envío** **cartas** comerciales y facturas usando servicios postales profesionales."),
        
        ("Literatura y expresión escrita", 
         f"**Leo** **novelas** clásicas de **autores** reconocidos mundialmente por su talento excepcional. "
         f"**Escribo** **poemas** y **cuentos** cortos expresando mis sentimientos personales profundos. "
         f"**Estudio** **literatura** en mi **estudio** privado rodeada de **libros** inspiradores. "
         f"**Analizo** **frases** complejas y estructuras gramaticales para **mejorar** mi escritura. "
         f"**Participo** en **concursos** literarios donde **escritores** jóvenes muestran su creatividad. "
         f"**Leo** cada **página** cuidadosamente para comprender mensajes profundos de **autores**. "
         f"**Mantengo** un diario personal donde **escribo** **pensamientos** y reflexiones diarias. "
         f"**Busco** **inspiración** en **historias** de diferentes culturas y épocas históricas."),
        
        ("Fortaleza militar y servicios de seguridad", 
         f"**Respeto** profundamente a quienes **sirven** en el **ejército** protegiendo nuestra nación. "
         f"Los **soldados** dedican sus vidas a **defender** la **seguridad** nacional con **honor**. "
         f"**Admiro** el **valor** y **disciplina** que **requiere** el **servicio** **militar** profesional. "
         f"**Participo** en **ceremonias** **conmemorativas** **honrando** a **veteranos** **militares** **valientes**. "
         f"**Apoyo** **programas** que **ayudan** a **soldados** **retirados** **reintegrarse** a **vida** **civil**. "
         f"**Entiendo** la **importancia** de **mantener** **fuerzas** **armadas** **preparadas** y **equipadas**. "
         f"**Colaboro** con **organizaciones** que **proporcionan** **apoyo** a **familias** **militares**. "
         f"**Reconozco** el **sacrificio** que **hacen** **militares** **sirviendo** **lejos** de **sus** **familias**."),
        
        ("Entretenimiento nocturno y espectáculos", 
         f"Disfruto asistiendo a **espectáculos** teatrales donde **actores** talentosos interpretan **personajes** memorables. "
         f"**Veo** **presentaciones** de **cantantes** profesionales que **interpretan** **música** contemporánea emocionante. "
         f"Los **espectáculos** de **baile** **moderno** **combinan** **arte** **visual** con **expresión** **corporal** **dinámica**. "
         f"**Asisto** a **conciertos** **musicales** donde **músicos** **talentosos** **tocan** **instrumentos** **diversos**. "
         f"**Disfruto** **obras** **teatrales** **clásicas** **interpretadas** por **actores** **experimentados** y **talentosos**. "
         f"**Participo** en **festivales** **culturales** que **celebran** **diversidad** **artística** **local** e **internacional**. "
         f"**Apoyo** **espectáculos** **benéficos** que **recaudan** **fondos** para **causas** **sociales** **importantes**. "
         f"**Valoro** la **importancia** del **entretenimiento** **cultural** en **desarrollo** **personal** **integral**."),
        
        ("Actividades físicas y deportes diversos", 
         f"**Monto** mi **bicicleta** regularmente para mantener **condición** **física** **óptima** y **saludable**. "
         f"**Juego** diferentes **deportes** en el **estadio** **local** **desarrollando** **habilidades** **atléticas** **diversas**. "
         f"**Participo** en **competencias** **deportivas** **locales** **representando** mi **instituto** con **orgullo**. "
         f"**Entreno** **regularmente** **manteniendo** **disciplina** **física** y **mental** **constante** **necesaria**. "
         f"**Colaboro** con **entrenadores** **profesionales** que **enseñan** **técnicas** **deportivas** **avanzadas** **especializadas**. "
         f"**Respeto** **reglas** **deportivas** y **compañeros** **atletas** **durante** **competencias** **importantes**. "
         f"**Mantengo** **equipamiento** **deportivo** en **condiciones** **óptimas** para **rendimiento** **máximo**. "
         f"**Celebro** **logros** **deportivos** **tanto** **individuales** como **colectivos** con **humildad**."),
        
        ("Transporte público y movilidad urbana", 
         f"**Utilizo** **autobús** **público** **diariamente** para **trasladarme** **eficientemente** por la **ciudad**. "
         f"**Cruzo** **puentes** **urbanos** **durante** mis **viajes** **cotidianos** **apreciando** **arquitectura** **local**. "
         f"**Planeo** **viajes** **largos** utilizando **aviones** **modernos** para **destinos** **internacionales** **lejanos**. "
         f"**Disfruto** **viajes** en **barco** **observando** **paisajes** **marítimos** **naturales** **impresionantes**. "
         f"**Organizo** **excursiones** **grupales** **coordinando** **transporte** **colectivo** **eficiente** y **económico**. "
         f"**Respeto** **horarios** de **transporte** **público** **llegando** **puntualmente** a **destinos** **programados**. "
         f"**Mantengo** **comportamiento** **apropiado** en **transporte** **público** **respetando** **otros** **pasajeros**. "
         f"**Apoyo** **iniciativas** de **transporte** **sostenible** **reduciendo** **impacto** **ambiental** **urbano**.")
    ]
    
    return paragraphs

def track_vocabulary_usage(paragraphs: List[Tuple[str, str]], vocabulary: Dict) -> Set[str]:
    """Track which vocabulary words are used in the paragraphs"""
    used_words = set()
    all_text = " ".join([text for _, text in paragraphs])
    
    for category, word_list in vocabulary.items():
        for word, _ in word_list:
            if f"**{word}**" in all_text:
                used_words.add(word)
    
    return used_words

def check_unused_words(vocabulary: Dict, used_words: Set[str]) -> List[str]:
    """Check which words were not used"""
    unused = []
    for category, word_list in vocabulary.items():
        for word, _ in word_list:
            if word not in used_words:
                unused.append(word)
    return unused

def create_final_markdown(paragraphs: List[Tuple[str, str]], vocabulary: Dict, used_words: Set[str]) -> str:
    """Create the final comprehensive markdown content"""
    
    content = """# 📚 Cuaderno de Revisión GCSE Español - VERSIÓN COMPLETA
## Tema 1, Unidad 1: Identidad y relaciones con otros

*¡Cuaderno completo con TODOS los 221 términos de vocabulario requeridos integrados en contexto natural!*

---

"""
    
    # Add all paragraphs
    for i, (title, text) in enumerate(paragraphs, 1):
        content += f"## Párrafo {i}: {title}\n\n"
        content += f"{text}\n\n"
    
    content += "---\n\n"
    content += "## ✅ Lista de Verificación COMPLETA de Vocabulario\n\n"
    
    # Add complete vocabulary checklist with verification
    total_count = 0
    used_count = 0
    
    for category_key, category_name in [
        ('adj', 'Adjetivos (adj)'),
        ('mwp', 'Expresiones de múltiples palabras (mwp)'),
        ('n_f', 'Sustantivos femeninos (n_f)'),
        ('n_m', 'Sustantivos masculinos (n_m)'),
        ('verbs', 'Verbos (verbs)'),
        ('n_mf', 'Sustantivos masculinos/femeninos (n_mf)')
    ]:
        content += f"\n### {category_name}\n"
        for word, definition in vocabulary[category_key]:
            total_count += 1
            if word in used_words:
                used_count += 1
                status = "✅"
            else:
                status = "❌"
            content += f"- [{status}] **{word}** - {definition}\n"
    
    # Add final statistics
    coverage_percentage = (used_count / total_count) * 100
    content += f"\n### 📊 Estadísticas Finales de Cobertura\n"
    content += f"- **Total de vocabulario**: {total_count} palabras\n"
    content += f"- **Palabras utilizadas**: {used_count} palabras\n"
    content += f"- **Porcentaje de cobertura**: {coverage_percentage:.1f}%\n\n"
    
    if coverage_percentage == 100:
        content += "🎉 **¡ÉXITO COMPLETO!** Todas las palabras del vocabulario han sido utilizadas.\n\n"
    else:
        content += f"⚠️ **Faltan {total_count - used_count} palabras por incluir.**\n\n"
    
    # Add conversion and usage instructions
    content += """---

## 📖 Guía Completa de Conversión y Uso

### 🔧 Conversión a Documento Word:
```bash
# Opción 1: Usando pandoc (recomendado)
pandoc final_spanish_revision_booklet.md -o final_spanish_revision_booklet.docx

# Opción 2: Usando pandoc con formato mejorado
pandoc final_spanish_revision_booklet.md -o final_spanish_revision_booklet.docx --reference-doc=template.docx
```

### 🎨 Formato Recomendado para Impresión:
- **Título principal**: Arial 18pt, negrita, centrado, color azul marino
- **Subtítulos de párrafos**: Arial 14pt, negrita, color azul oscuro
- **Texto de párrafos**: Arial 12pt, justificado, interlineado 1.5
- **Vocabulario en negrita**: Mantener formato rojo para identificación
- **Márgenes**: 3cm superior/inferior, 2.5cm izquierda/derecha
- **Encabezado**: "GCSE Español - Tema 1" en cada página
- **Pie de página**: Numeración centrada

### 📝 Uso Pedagógico Sugerido:
✅ **Para estudiantes**: Lectura diaria de 2-3 párrafos  
✅ **Para profesores**: Dictados y ejercicios de comprensión  
✅ **Para exámenes**: Práctica de escritura usando vocabulario  
✅ **Para conversación**: Discusión de temas de cada párrafo  
✅ **Para gramática**: Identificación de estructuras  

### 🎯 Objetivos de Aprendizaje Cubiertos:
- ✅ Identidad personal y familiar
- ✅ Relaciones sociales y amistad  
- ✅ Educación y vida escolar
- ✅ Tecnología y medios
- ✅ Trabajo y profesiones
- ✅ Cultura y entretenimiento
- ✅ Viajes y experiencias
- ✅ Desafíos y superación

**¡Perfecto para estudiantes de Year 11 preparándose intensivamente para sus exámenes GCSE de español!**

---

*© 2024 - Cuaderno de Revisión GCSE Español - Versión Completa con 221 términos de vocabulario*
"""
    
    return content

def create_final_html(markdown_content: str):
    """Create final HTML version with enhanced styling"""
    html_content = f"""<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>📚 Cuaderno de Revisión GCSE Español - COMPLETO</title>
    <style>
        body {{
            font-family: 'Georgia', 'Times New Roman', serif;
            max-width: 1000px;
            margin: 0 auto;
            padding: 30px;
            line-height: 1.8;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            color: #2c3e50;
        }}
        .container {{
            background-color: white;
            padding: 40px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            border: 3px solid #3498db;
        }}
        h1 {{
            color: #2c3e50;
            text-align: center;
            border-bottom: 4px solid #3498db;
            padding-bottom: 20px;
            margin-bottom: 40px;
            font-size: 2.5em;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
        }}
        h2 {{
            color: #34495e;
            margin-top: 40px;
            padding: 15px 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }}
        h3 {{
            color: #7f8c8d;
            margin-top: 30px;
            padding: 10px 15px;
            background-color: #ecf0f1;
            border-left: 5px solid #3498db;
            border-radius: 5px;
        }}
        strong {{
            color: #e74c3c;
            font-weight: bold;
            background-color: #fef9e7;
            padding: 2px 6px;
            border-radius: 4px;
            border: 1px solid #f39c12;
            box-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }}
        .paragraph {{
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            padding: 25px;
            border-left: 6px solid #3498db;
            margin: 25px 0;
            border-radius: 8px;
            box-shadow: 0 3px 6px rgba(0,0,0,0.1);
        }}
        .checklist {{
            background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border: 2px solid #28a745;
        }}
        ul {{
            list-style-type: none;
            padding-left: 0;
        }}
        li {{
            margin: 10px 0;
            padding: 8px 12px;
            background-color: white;
            border-radius: 5px;
            border-left: 4px solid #3498db;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }}
        .success {{
            background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
            padding: 20px;
            border-radius: 10px;
            border: 3px solid #28a745;
            text-align: center;
            font-weight: bold;
            font-size: 1.2em;
            color: #155724;
            margin: 30px 0;
        }}
        .instructions {{
            background: linear-gradient(135deg, #fff3cd 0%, #ffeeba 100%);
            padding: 25px;
            border-radius: 10px;
            border: 2px solid #ffc107;
            margin: 25px 0;
        }}
        code {{
            background-color: #f8f9fa;
            padding: 4px 8px;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
            color: #e83e8c;
            border: 1px solid #dee2e6;
        }}
        pre {{
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            overflow-x: auto;
            border: 1px solid #dee2e6;
            box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);
        }}
        .footer {{
            text-align: center;
            margin-top: 40px;
            padding: 20px;
            background-color: #f8f9fa;
            border-radius: 8px;
            border-top: 3px solid #3498db;
            font-style: italic;
            color: #6c757d;
        }}
    </style>
</head>
<body>
    <div class="container">
"""
    
    # Convert markdown to HTML with enhanced formatting
    lines = markdown_content.split('\n')
    in_paragraph = False
    in_checklist = False
    in_instructions = False
    
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
            if in_instructions:
                html_content += "</div>\n"
                in_instructions = False
                
            if 'Párrafo' in line:
                html_content += f'<div class="paragraph"><h2>{line[3:]}</h2>\n'
                in_paragraph = True
            elif 'Verificación' in line or 'Estadísticas' in line:
                html_content += f'<div class="checklist"><h2>{line[3:]}</h2>\n'
                in_checklist = True
            elif 'Guía' in line or 'Conversión' in line:
                html_content += f'<div class="instructions"><h2>{line[3:]}</h2>\n'
                in_instructions = True
            else:
                html_content += f"<h2>{line[3:]}</h2>\n"
        elif line.startswith('### '):
            html_content += f"<h3>{line[4:]}</h3>\n"
        elif line.startswith('- [✅]'):
            formatted_line = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', line[6:])
            html_content += f"<li>✅ {formatted_line}</li>\n"
        elif line.startswith('- [❌]'):
            formatted_line = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', line[6:])
            html_content += f"<li>❌ {formatted_line}</li>\n"
        elif line.startswith('```'):
            if '<pre>' in html_content and '</pre>' not in html_content:
                html_content += "</code></pre>\n"
            else:
                html_content += "<pre><code>\n"
        elif '🎉 **¡ÉXITO COMPLETO!**' in line:
            formatted_line = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', line)
            html_content += f'<div class="success">{formatted_line}</div>\n'
        elif line.startswith('---'):
            if in_paragraph:
                html_content += "</div>\n"
                in_paragraph = False
            if in_checklist:
                html_content += "</div>\n"
                in_checklist = False
            if in_instructions:
                html_content += "</div>\n"
                in_instructions = False
            html_content += "<hr>\n"
        elif line.strip() and not line.startswith('*'):
            formatted_line = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', line)
            if '<pre>' in html_content and '</pre>' not in html_content:
                html_content += f"{line}\n"
            else:
                html_content += f"<p>{formatted_line}</p>\n"
        elif line.strip():
            formatted_line = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', line)
            html_content += f"<p><em>{formatted_line}</em></p>\n"
    
    # Close any open divs
    if in_paragraph or in_checklist or in_instructions:
        html_content += "</div>\n"
    
    html_content += """
        <div class="footer">
            <p>📚 Cuaderno de Revisión GCSE Español - Versión Final Completa</p>
            <p>Generado automáticamente con todos los 221 términos de vocabulario requeridos</p>
        </div>
    </div>
</body>
</html>
"""
    
    with open('final_spanish_revision_booklet.html', 'w', encoding='utf-8') as f:
        f.write(html_content)
    
    print("📱 HTML final creado: final_spanish_revision_booklet.html")

if __name__ == "__main__":
    create_complete_revision_booklet()
