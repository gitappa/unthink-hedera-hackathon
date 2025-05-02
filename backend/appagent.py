# from fastapi import FastAPI, Request
# from fastapi.middleware.cors import CORSMiddleware
# from fastapi.responses import StreamingResponse
# import asyncio
# import json
# import os
# import base64
# import json
# import requests
# from google import genai
# from google.genai import types


# client = genai.Client(
#     api_key="AIzaSyDvYvaU3saMKp8zY6LG2_Ker8wSxTqeGxo",
# )

# files = [
#     client.files.upload(file="igpostsdescription_data_cleanedv4.csv"),
# ]

# sys_inst = """Chat nicely"""

# app = FastAPI()

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )


# async def get_response(message: str):
#     model = "gemini-2.0-flash-001"
#     contents = [
#         types.Content(
#             role="user",
#             parts=[
#                 types.Part.from_uri(
#                     file_uri=files[0].uri,
#                     mime_type=files[0].mime_type,
#                 ),
#                 types.Part.from_text(text=message),
#             ],
#         ),
#     ]
#     generate_content_config = types.GenerateContentConfig(
#         response_mime_type="text/plain",
#         system_instruction=[
#             types.Part.from_text(text=sys_inst),
#         ],
#     )
    
#     resp = client.models.generate_content(
#         model=model,
#         contents=contents,
#         config=generate_content_config,
#     )
#     return resp.text

# @app.post("/chat")
# async def chat(request: Request):
#     data = await request.json()
#     message = data.get("message", "")
#     print(message)
#     response = await get_response(message)

#     return response

# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="0.0.0.0", port=8000)