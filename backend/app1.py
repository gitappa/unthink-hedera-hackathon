from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import asyncio
import json
from langchain.schema import HumanMessage
import os
from langchain.agents import AgentExecutor, create_react_agent, Tool, initialize_agent
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.memory import ConversationBufferMemory
from langchain.chains import LLMChain
from uuid import uuid4


with open(r"F:\Unthink_official_project\agentpersonal\project-bolt-sb1-gspsvggc\project\backend\user_data.json", "r") as file:
    user_data = json.load(file)

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


async def get_openai_response(message: str, user_id: str, session_id: str):

    def get_user_data(user_id: str) -> str:
        if user_id in user_data:
            return f"User data: {user_data[user_id]}"
        else:
            return "User not found."


    user_data_tool = Tool(
        name="get_user_data",
        func=get_user_data,
        description="Retrieves user data from the user data dictionary. The input should be the user ID.",
    )

    # 3. Define an LLM
    llm = ChatOpenAI(
        model_name="gpt-4o-mini",
        temperature=0.3,
        openai_api_key=os.getenv('OPENAI_API_KEY')
    )

    # 4. Create the prompt
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are a helpful and friendly assistant for an e-commerce website. Before responding, use the `get_user_data` tool to get the user's information. Then answer their questions based on the data available and any previous interactions. Respond conversationally and in a natural way. Don't directly give the structured data to the user."),
        MessagesPlaceholder(variable_name="chat_history"),
        ("user", "{input}"),
    ])

    instruction = """You are a helpful and friendly assistant for an e-commerce website. Before responding, use the `get_user_data` tool to get the user's information. Then answer their questions based on the data available and any previous interactions. Respond conversationally and in a natural way. Don't directly give the structured data to the user."""

    # 5. Initialize Memory
    memory_store = {}

    def get_memory(session_id):
        if session_id not in memory_store:
            memory_store[session_id] = ConversationBufferMemory(memory_key="chat_history", return_messages=True)
        return memory_store[session_id]

    # 7. Initialize Agent
    def run_agent(query, user_id, session_id):
        tools = [user_data_tool]
        agent = initialize_agent(
            tools=tools,
            memory = get_memory(session_id),
            llm=llm,
            agent="chat-conversational-react-description",
            verbose=True
        )

        response = agent.run(
            input =f"Instruction: {instruction} User ID: {user_id}\n Query: {query}"
            )

        return response
    
    return run_agent(message, user_id, session_id)
    
    # """Get response from OpenAI using LangChain"""
    # chat = ChatOpenAI(
    #     model_name="gpt-4o-2024-11-20",
    #     temperature=0.3,
    #     openai_api_key=os.getenv('OPENAI_API_KEY')
    # )

    # messages = [HumanMessage(content=message)]
    # response = chat.invoke(messages)

    # return response.content

@app.post("/chat")
async def chat(request: Request):
    data = await request.json()
    message = data.get("message", "")
    assistant_id = data.get("assistant_id", "")
    session_id = data.get("session_id", "")

    print(session_id)

    response = await get_openai_response(message, assistant_id, session_id)

    return response

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)