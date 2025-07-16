import React from 'react';
import {CheckCircle, TwitchLogo} from "phosphor-react";
import {useAppDispatch} from "../app/hooks";
import AppLayout from "../components/layout/AppLayout";
import {login} from "../features/auth/authSlice";
import Button from "../components/ui/Button";

export default function HomePage() {
    const dispatch = useAppDispatch();

    return (
        <AppLayout>
            <div className="max-w-4xl mx-auto py-12 px-4">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-white mb-4">CLIPIT</h1>
                    <p className="text-xl text-text-secondary">
                        Enqueue and play clips from your Twitch Chat using nothing more than your web browser
                    </p>
                </div>

                <QuickstartSection onLogin={() => dispatch(login())} />
                <FeaturesSection />
            </div>
        </AppLayout>
    );
}

function QuickstartSection({ onLogin }) {
    return (
        <div className="bg-card rounded-lg p-8 mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">Quickstart</h2>
            <p className="text-text-primary mb-6">
                Simply <span className="font-bold">Login with Twitch</span>. You'll be redirected to Twitch and
                asked to allow the application to get your username and read chat in your name. Any information received from Twitch is not
                sent anywhere but Twitch. By default you'll join your channel's chat, but you can change the channel afterwards.
                The only thing left to do is to <span className="font-bold">open the queue</span> and wait for some clip links to be posted in chat.
            </p>

            <div className="flex justify-center">
                <Button
                    variant="primary"
                    size="lg"
                    leftIcon={<TwitchLogo size={20} weight="fill" />}
                    onClick={onLogin}
                >
                    Login with Twitch
                </Button>
            </div>
        </div>
    );
}

function FeaturesSection() {
    const features = [
        {
            title: "Supports multiple clip providers",
            description: "Works with Twitch clip, Twitch VOD, YouTube and Streamable video links"
        },
        {
            title: "Integrates with Twitch chat",
            description: "Gathers links from messages to build the queue, by default from your chat but can join arbitrary channels"
        },
        {
            title: "Deduplicates clips",
            description: "Prevents from adding the same clip to the queue multiple times, persists remembered clips between queues"
        },
        {
            title: "Recognizes clip popularity",
            description: "When the same clip is posted by multiple users it will be moved up in the queue"
        },
        {
            title: "Offers basic queue management",
            description: "Allows playing clips out of order, removing clips from queue, clearing the queue and purging persistent clip memory"
        },
        {
            title: "Handles deleted messages and timed out users",
            description: "When a message with clip link is deleted from chat it is removed from the queue as well. If a user that submitted clips is timed out their clips are removed from the queue (unless someone else submitted the clip as well)"
        },
        {
            title: "Respects privacy",
            description: "Does not store any personal data, does not communicate with any third party services. Requires permission only to get your username and read chat"
        },
        {
            title: "Allows channel moderators to control the queue using chat commands",
            description: "Moderators can use commands like !queuenext, !queueopen, !queueclose, and more"
        }
    ];

    return (
        <div className="bg-card rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Features</h2>

            <ul className="space-y-6">
                {features.map((feature, index) => (
                    <li key={index} className="flex gap-4">
                        <div className="flex-shrink-0 mt-1">
                            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                <CheckCircle size={16} weight="bold" className="text-white" />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                            <p className="text-text-secondary">{feature.description}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
