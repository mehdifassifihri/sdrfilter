from http.client import HTTPException
import glob
import constants as cs
import pandas as pd
from fastapi import FastAPI,Request
from models.MessageIds import MessageIds
from models.filter import Filter
from sdr_trace import retracer_messages
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import csv
import os
import uvicorn
from py_eureka_client import eureka_client

app = FastAPI()

EUREKA_SERVER = "http://localhost:8761/eureka"

# Application details
APP_NAME = "SDR-SERVICES"
APP_PORT = 8000

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],    # Allow all methods
    allow_headers=["*"],    # Allow all headers
)





@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.post("/retrieve_messages/")
def retrieve_messages(data: Filter):
    try:
        print(data)
        message_ids = retracer_messages(data)
        if message_ids:
            return {"message_ids": message_ids}
        else:
            return {"message": "No messages found"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/find_by_message_id/")
def find_by_message_id(msg_ids: MessageIds):
    fichiers_csv = glob.glob("/Users/MEHDI/Downloads/test2/*.csv")
    resultats_sm = []
    resultats_sip = []

    for fichier in fichiers_csv:
        try:
            if "SM" in fichier:
                df = pd.read_csv(fichier, header=None, names=cs.noms_colonnes_sm, low_memory=False)
                df_filtre = df[df['MSG_ID'].isin(msg_ids.ids)].fillna("None")
                if not df_filtre.empty:
                    resultats_sm.extend(df_filtre.to_dict(orient='records'))
            elif "SIP" in fichier:
                df = pd.read_csv(fichier, header=None, names=cs.noms_colonnes_sip, low_memory=False)
                df_filtre = df[df['MSG_ID'].isin(msg_ids.ids)].fillna("None")
                if not df_filtre.empty:
                    resultats_sip.extend(df_filtre.to_dict(orient='records'))
        except pd.errors.EmptyDataError:
            print(f"Le fichier {fichier} est vide ou invalide et sera ignoré.")

    return {
        "SMResults": resultats_sm,
        "SIPResults": resultats_sip
    }


@app.post("/generate_csv")
async def generate_csv(request: Request):
    data = await request.json()
    csv_files = []

    # Process SMResults
    sm_results = data.get("SMResults", [])
    sm_file_path = "SMResults.csv"
    with open(sm_file_path, mode='w', newline='') as file:
        writer = csv.writer(file)
        if sm_results:
            writer.writerow(sm_results[0].keys())  # Write header
            for entry in sm_results:
                writer.writerow(entry.values())
        csv_files.append(sm_file_path)

    # Process SIPResults
    sip_results = data.get("SIPResults", [])
    sip_file_path = "SIPResults.csv"
    with open(sip_file_path, mode='w', newline='') as file:
        writer = csv.writer(file)
        if sip_results:
            writer.writerow(sip_results[0].keys())  # Write header
            for entry in sip_results:
                writer.writerow(entry.values())
        csv_files.append(sip_file_path)

    return FileResponse(f"./{sm_file_path}", media_type='application/octet-stream', filename=sm_file_path)

@app.get("/download_csv/{file_name}")
async def download_csv(file_name: str):
    file_path = f"./{file_name}"
    if os.path.exists(file_path):
        return FileResponse(file_path, media_type='application/octet-stream', filename=file_name)
    return {"error": "File not found"}

def get_resp_code_distribution(df):
    message_type_distribution = df['SIP_RESP_CODE'].value_counts().reset_index(name='count')
    message_type_distribution.columns = ['SIP_RESP_CODE', 'count']
    return message_type_distribution

@app.get("/message_type_distribution/")
def message_type_distribution():
    fichiers_csv = glob.glob("/Users/MEHDI/Downloads/test2/*.csv")
    combined_df = pd.DataFrame()

    for fichier in fichiers_csv:
        try:
            if "SIP" in fichier:
                df = pd.read_csv(fichier, header=None, names=cs.noms_colonnes_sip, low_memory=False)
                combined_df = pd.concat([combined_df, df], ignore_index=True)
        except pd.errors.EmptyDataError:
            print(f"Le fichier {fichier} est vide ou invalide et sera ignoré.")

    message_type_dist = get_resp_code_distribution(combined_df)

    return {
        "sip": message_type_dist.to_dict(orient="records"),
    }

def get_message_type_distribution(df):
    message_type_distribution = df['MSG_STATUS'].value_counts().reset_index(name='count')
    message_type_distribution.columns = ['MSG_STATUS', 'count']
    return message_type_distribution

@app.get("/msgstatus/")
def message_type_distribution():
    fichiers_csv = glob.glob("/Users/MEHDI/Downloads/test2/*.csv")
    combined_df = pd.DataFrame()

    for fichier in fichiers_csv:
        try:
            if "SM" in fichier:
                df = pd.read_csv(fichier, header=None, names=cs.noms_colonnes_sm, low_memory=False)
                combined_df = pd.concat([combined_df, df], ignore_index=True)
        except pd.errors.EmptyDataError:
            print(f"Le fichier {fichier} est vide ou invalide et sera ignoré.")

    message_type_dist = get_message_type_distribution(combined_df)

    return {
        "sip": message_type_dist.to_dict(orient="records"),
    }


@app.get("/hello/{name}")
async def say_hello(name: str):
    return {"message": f"Hello {name}"}

if __name__ == "__main__":
    # Register service to Eureka server
    eureka_client.init(
        eureka_server=EUREKA_SERVER,
        app_name=APP_NAME,
        instance_port=APP_PORT,
    )
    uvicorn.run(app, host="0.0.0.0", port=APP_PORT)



