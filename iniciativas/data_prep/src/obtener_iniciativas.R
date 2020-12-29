# Autora: Laura Junco
# Fecha: 20/10/2020
# R version 4.0.2

#cargar librerias
library(tidyverse) 
library(here)

#rutas de archivos
inputdb <- here::here("data_prep/input/iniciativas_convivencia.csv")
iniciativas_csv <- here::here("data_prep/output/iniciativas.csv")
deptos_csv <- here::here("data_prep/output/deptos.csv")
anios_csv <- here::here("data_prep/output/anios.csv")

df <- read_delim(inputdb, ";")

new_df <- df %>%
  select(
          "A1_1_dia_mes_anio", # Fecha inicio
          "A2_1",              # Departamento
          "A2_2_Mun_1",        # Municipio
          "A_4",               # Nombre experiencia
          "A_5",               # Grupo que desarrolló la exp
          "B_1",               # Sector al que pertenece el tipo de actor
          "B_4",               # Descripcion de la exp
          "C_1",               # Convivencia Democrática
          "C_2",               # C2: Resistencias no violentas
          "C_3",               # C3: Transformaciones para la paz
          "C_4",               # C4: Gestión pacifica de conflictos
          "C_21",              # C2: Defensa de la vida y del territorio
          "C_22",              # C2: Proteger de los atasques selectivos a líderes (as) y activistas
          "C_23",              # C2: Alternativas económicas al/de desarrollo       
          "C_24",              # C2: Defensa de identidades colectivas
          "C_31",              # C3: Cultura y educación de paz
          "C_32",              # C3: Procesos de memoria colectiva
          "C_33",              # C3: Organización y articulación a redes
          "C_34",              # C3: Procesos de desarrollo y paz
          "C_35",              # C3: Protección del medioambiente
          "C_41",              # C4: Diálogo y negociación específicos
          "C_42",              # C4: Diálogo y negociación estratégicos
          "C_43"               # C4: Procesos de reincorporación y de reconciliación de excombatientes
        ) 

#renombrar variables
new_df <- new_df %>%
  rename (
          inicio = "A1_1_dia_mes_anio", 
          depto = "A2_1",              
          mpio = "A2_2_Mun_1",       
          nombre = "A_4",               
          actor = "A_5",               
          tipo_actor = "B_1",               
          descripcion = "B_4",               
          convivencias = "C_1",               
          C_resistencia = "C_2",               
          C_transformacion = "C_3",               
          C_gestion_pacifica = "C_4"
  )

#eliminar comillas
new_df <- new_df %>%
  mutate (
    inicio = gsub("\"","", inicio), 
    depto = gsub("\"","", depto),              
    mpio = gsub("\"","", mpio),         
    nombre = gsub("\"","", nombre),                 
    actor = gsub("\"","", actor),                 
    tipo_actor = gsub("\"","", tipo_actor),                 
    descripcion = gsub("\"","", descripcion),               
    convivencias = gsub("\"","", convivencias),               
    C_resistencia = gsub("\"","", C_resistencia),                           
    C_transformacion = gsub("\"","", C_transformacion),           
    C_gestion_pacifica = gsub("\"","", C_gestion_pacifica)
  )

#formato año
new_df <- new_df %>%
  mutate(inicio = sapply(strsplit(inicio,"/"), `[`, 3),
          inicio = as.numeric(inicio),
          inicio = case_when (
            inicio >= 22 ~ (inicio + 1900),
            inicio < 1910 ~ (inicio + 2000) ,
            is.na(inicio) ~ 999
          )
        ) %>%
  filter(inicio <= 2021) %>% 
  arrange(inicio)


#formato dpto
new_df <- new_df %>%
    mutate(depto = recode(depto, 
        "Antioquia" = "ANTIOQUIA",
        "Atl<U+00E1>ntico" = "ATLANTICO",
        "Bogot<U+00E1> D.C." = "SANTAFE DE BOGOTA D.C",
        "Boyac<U+00E1>" = "BOYACA",
        "Caquet<U+00E1>" = "CAQUETA",
        "Cauca" = "CAUCA",
        "Cesar" = "CESAR",
        "C<U+00F3>rdoba" = "CORDOBA",
        "Caldas" = "CALDAS",
        "Cundinamarca" = "CUNDINAMARCA",
        "Choc<U+00F3>" = "CHOCO"  ,
        "Huila" = "HUILA",
        "La Guajira" = "LA GUAJIRA",
        "Magdalena" = "MAGDALENA",
        "Meta" = "META",
        "Nari<U+00F1>o" = "NARINO",
        "Norte de Santander" = "NORTE DE SANTANDER",
        "Quind<U+00ED>o" = "QUINDIO",
        "Risaralda" = "RISARALDA",
        "Santander" = "SANTANDER",
        "Sucre" =  "SUCRE",
        "Tolima" = "TOLIMA",
        "Valle del Cauca" = "VALLE DEL CAUCA",
        "Arauca" = "ARAUCA",
        "Casanare" = "CASANARE",
        "Putumayo" = "PUTUMAYO",
        "Amazonas" = "AMAZONAS",
        "Bol<U+00ED>var" = "BOLIVAR",
        "Guaviare" = "GUAVIARE",
        "Nacional" = "NACIONAL",
        "Internacional" = "INTERNACIONAL"
        )
    )

#Convertir columnas a binarias
new_df <- new_df %>%
  mutate(C_resistencia = sapply(strsplit(C_resistencia,"=="), `[`, 1),
         C_resistencia = as.numeric(C_resistencia),
         C_transformacion = sapply(strsplit(C_transformacion,"=="), `[`, 1),
         C_transformacion = as.numeric(C_transformacion),
         C_gestion_pacifica = sapply(strsplit(C_gestion_pacifica,"=="), `[`, 1),
         C_gestion_pacifica = as.numeric(C_gestion_pacifica),
         C_21 = sapply(strsplit(C_21,"=="), `[`, 1),
         C_21 = as.numeric(C_21),
         C_22 = sapply(strsplit(C_22,"=="), `[`, 1),
         C_22 = as.numeric(C_22),
         C_23 = sapply(strsplit(C_23,"=="), `[`, 1),
         C_23 = as.numeric(C_23),
         C_24 = sapply(strsplit(C_24,"=="), `[`, 1),
         C_24 = as.numeric(C_24),
         C_31 = sapply(strsplit(C_31,"=="), `[`, 1),
         C_31 = as.numeric(C_31),
         C_32 = sapply(strsplit(C_32,"=="), `[`, 1),
         C_32 = as.numeric(C_32),
         C_33 = sapply(strsplit(C_33,"=="), `[`, 1),
         C_33 = as.numeric(C_33),
         C_34 = sapply(strsplit(C_34,"=="), `[`, 1),
         C_34 = as.numeric(C_34),
         C_35 = sapply(strsplit(C_35,"=="), `[`, 1),
         C_35 = as.numeric(C_35),
         C_41 = sapply(strsplit(C_41,"=="), `[`, 1),
         C_41 = as.numeric(C_41),
         C_42 = sapply(strsplit(C_42,"=="), `[`, 1),
         C_42 = as.numeric(C_42),
         C_43 = sapply(strsplit(C_43,"=="), `[`, 1),
         C_43 = as.numeric(C_43),
        )

new_df <- new_df %>%
  mutate(categoria = case_when (
                C_resistencia == 1 ~ "Resistencias no violentas",
                C_transformacion == 1 ~ "Transformaciones para la paz",
                C_gestion_pacifica == 1 ~"Gestion pacifica de conflictos"
              )
            )

# new_df <- new_df %>%
#   select(-C_resistencia, -C_transformacion, -C_gestion_pacifica)

#db deptos
deptos_df <- new_df
deptos_df <- deptos_df %>%
  filter(depto != "999" & 
        depto != "NACIONAL" & 
        depto != "INTERNACIONAL"
        ) %>%
  group_by(depto) %>%
  summarize(count = n())

#db años
anios_df <- new_df %>%
  rename(anio = inicio) %>%
  filter(anio > 1957 &
          anio != 999 &
        !is.na(anio)) %>%
  group_by(anio) %>%
  arrange(anio)  %>% 
  summarize(count = n())

#exportar csvs
write_csv(new_df, iniciativas_csv)
#write_csv(deptos_df, deptos_csv)
#write_csv(anios_df, anios_csv)

#listo!