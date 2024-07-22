import glob
import pandas as pd
import constants as cn
from models.filter import Filter


def retracer_messages(data:Filter) -> list:
    fichiers_csv = glob.glob("/Users/MEHDI/Downloads/test2/*.csv")
    message_ids = []
    message_type = data.sdrtype

    for fichier in fichiers_csv:
        try:
            if message_type in fichier:
                if message_type == "SM":
                    df = pd.read_csv(fichier, header=None, names=cn.noms_colonnes_sm, low_memory=False)
                elif message_type == "SIP":
                    df = pd.read_csv(fichier, header=None, names=cn.noms_colonnes_sip, low_memory=False)
                elif message_type == "MAP":
                    df = pd.read_csv(fichier, header=None, names=cn.noms_colonnes_map, low_memory=False)

                # Handle NaN values
                df = df.fillna("")

                criteria = True
                for key, value in data.filters.items():
                    criteria &= (df[key] == value)

                df_filtre = df[criteria]
                if not df_filtre.empty:
                    message_ids.extend([msg_id for msg_id in df_filtre["MSG_ID"].tolist() if msg_id])
        except pd.errors.EmptyDataError:
            print(f"Le fichier {fichier} est vide ou invalide et sera ignoré.")


    return message_ids

def findByMessageId(msg_ids):
    fichiers_csv = glob.glob("/mnt/nas_medmetro/smsc/metrologie/data/archives/test2/*.csv")
    resultats_sm = []  # Liste pour stocker les résultats SM
    resultats_sip = []  # Liste pour stocker les résultats SIP

    # Définir les noms des colonnes pour les fichiers SM et SIP
    noms_colonnes_sm = cn.noms_colonnes_sm
    noms_colonnes_sip = cn.noms_colonnes_sip

    for fichier in fichiers_csv:
        try:
            if "SM" in fichier:
                df = pd.read_csv(fichier, header=None, names=noms_colonnes_sm, low_memory=False)
                df_filtre = df[df['MSG_ID'].isin(msg_ids)]
                if not df_filtre.empty:
                    resultats_sm.append(df_filtre)
            elif "SIP" in fichier:
                df = pd.read_csv(fichier, header=None, names=noms_colonnes_sip, low_memory=False)
                df_filtre = df[df['MSG_ID'].isin(msg_ids)]
                if not df_filtre.empty:
                    resultats_sip.append(df_filtre)
        except pd.errors.EmptyDataError:
            print(f"Le fichier {fichier} est vide ou invalide et sera ignoré.")

    # Afficher et sauvegarder les résultats combinés
    if resultats_sm or resultats_sip:
        with open('resultats_combines.csv', 'w') as f:
            if resultats_sm:
                resultats_sm_df = pd.concat(resultats_sm)
                print("SM")
                print("-------------")
                print(resultats_sm_df)
                f.write("Résultats SM:\n")
                resultats_sm_df.to_csv(f, index=False)

            if resultats_sip:
                if resultats_sm:
                    f.write("\n---\n")  # Separator line between SM and SIP results
                resultats_sip_df = pd.concat(resultats_sip)
                print("SIP")
                print("-------------")
                print(resultats_sip_df)
                f.write("Résultats SIP:\n")
                resultats_sip_df.to_csv(f, index=False)
    else:
        print("Aucun résultat trouvé pour ce Message ID.")
