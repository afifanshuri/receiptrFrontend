import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { fetchAIResponse } from "../../service/receiptrBotService";
import { useSelector } from "react-redux";
import { Button } from "../../components/ui/button";
import "./ReceiptrBotDisplay.css"
import { Spinner } from "@/components/ui/spinner"

const ReceiptrBotDisplay = () => {
    const [question, setQuestion] = useState("");
    const [result, setResult] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const user = useSelector((state) => state.user);

    async function onAskBot() {
        setIsLoading(true);
        const response = await fetchAIResponse(question, user);
        setIsLoading(false);
        setResult(response);
    }

    return (
        <div id="aiSearchBar" >
            <div id="receiptrBotSearchContainer">
                <Input type="text" placeholder="What are you looking for?" onChange={(e) => setQuestion(e.target.value)} disabled={isLoading} />
                <Button className="clickableButton" onClick={() => { onAskBot() }} disabled={isLoading}> {isLoading ? (
                    <>
                        <Spinner size="sm" />
                        <span style={{ marginLeft: "8px" }}>Thinking...</span>
                    </>
                ) : (
                    "Ask"
                )}</Button>
            </div>
            <div>
                {!isLoading && result && (
                    <p id="aiSearchResult">{result}</p>
                )}
            </div>
        </div>
    )
}

export default ReceiptrBotDisplay;