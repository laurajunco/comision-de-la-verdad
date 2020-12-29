# Autora: Laura Junco
# Fecha: 07/10/2020
# Recorre la matriz

obtener_enlaces <- function(df, tipo, df_target, csv, append) {

       col_length <- ncol(df)
       row_length <- nrow(df)

       #Recorre todas las filas
       for (j in 1:row_length) {
              nom_sentencia <- toString(df[j,1]) #guardar nombre de sentencia
              print(nom_sentencia)

              #recorre todas las columnas de cada fila
              for(i in 3 : col_length - 1) {
                     nom_target <- colnames(df[0,i]) #nombre de target
                     value <- as.numeric(df[j,i])

                     #si aparece el término agrega una fila a df_enlaces
                     if (value != 0 ) { 
                            df_target <- df_target %>% 
                                   add_row(
                                          sentencia = nom_sentencia, 
                                          target = nom_target,
                                          value = value,
                                          tipo = tipo
                                          )
                     }
              }
       }
       df_target %>% 
              filter( !str_detect(target, 'Juan Francisco Prada'),
                     target != "El Tiempo"
              ) %>%
              write_csv(csv, append = TRUE, col_names = append)

       print("done")
}