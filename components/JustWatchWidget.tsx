// @ts-nocheck - JustWatchWidget is not a module
import React, { useEffect, useRef } from "react";

interface JustWatchWidgetProps {
    id: string;
    objectType: string;
    title: string;
}

const API_KEY = "ABCdef12";
const ID_TYPE = "tmdb";

export default function JustWatchWidget(props: JustWatchWidgetProps) {
    const { objectType, id, title } = props;
    const scriptRef = useRef<HTMLScriptElement | null>(null);
    console.log({ objectType, id, title })
    useEffect(() => {
        // Check if the script is already present
        if (!scriptRef.current) {
            const existingScript = document.querySelector("script[src='https://widget.justwatch.com/justwatch_widget.js']");

            if (!existingScript) {
                const script = document.createElement('script');
                script.src = 'https://widget.justwatch.com/justwatch_widget.js';
                script.async = true;
                document.body.appendChild(script);
                scriptRef.current = script;
            } else {
                scriptRef.current = existingScript as HTMLScriptElement;
            }
        } else if (window.JustWatch && window.JustWatch.reloadWidgets) {
            // If the script is already loaded and the JustWatch global exists, try re-initializing the widget
            window.JustWatch.reloadWidgets();
        }
    }, []);
    const frameStyle = {
        border: '3px solid #333',
        borderRadius: '5px',
        backgroundColor: '#f1f1f1',
        padding: '10px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)'
    };
    return (
        <div className="dark:bg-gray-900">
            <h2 className="text-xl font-semibold text-gray-300 mb-2">You can watch {title} here!</h2>
            <p className="text-gray-500 mb-4">These are a ways for you to watch {title}</p>
            <div className="rounded-lg overflow-hidden shadow-lg mb-4 relative">
                <div
                    data-jw-widget=""
                    data-api-key={API_KEY}
                    data-object-type={objectType === 'movie' ? 'movie' : 'show'}
                    data-id={id}
                    data-id-type={ID_TYPE}
                ></div>
            </div>
        </div>
    );
}
