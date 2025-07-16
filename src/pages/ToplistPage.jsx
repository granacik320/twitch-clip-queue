import React from 'react';
import { useSelector } from 'react-redux';
import { Trophy, Medal } from 'phosphor-react';
import {selectUsers} from "../features/clips/toplist/toplistSlice";
import AppLayout from "../components/layout/AppLayout";

export default function ToplistPage() {
    const users = useSelector(selectUsers);

    return (
        <AppLayout>
            <div className="max-w-4xl mx-auto py-8 px-4">
                <div className="flex items-center gap-2 mb-8">
                    <Trophy size={28} className="text-yellow-500" weight="fill" />
                    <h1 className="text-2xl font-bold text-white">Top Viewers</h1>
                </div>

                {users.length > 0 ? (
                    <div className="bg-card rounded-lg overflow-hidden">
                        <table className="w-full">
                            <thead>
                            <tr className="border-b border-border">
                                <th className="px-6 py-4 text-left text-sm font-medium text-text-secondary">Rank</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-text-secondary">User</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-text-secondary">Points</th>
                            </tr>
                            </thead>
                            <tbody>
                            {users.map((user, index) => (
                                <tr
                                    key={user.name}
                                    className={index % 2 === 0 ? 'bg-card' : 'bg-surface'}
                                >
                                    <td className="px-6 py-4">
                                        <RankBadge rank={index + 1} />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="font-medium text-white">{user.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-white">
                                        {user.points} points
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="bg-card rounded-lg p-8 text-center">
                        <p className="text-text-secondary text-lg mb-4">
                            No top users data available yet
                        </p>
                        <p className="text-text-secondary">
                            As viewers submit clips and receive likes, they'll start appearing in this leaderboard.
                        </p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

function RankBadge({ rank }) {
    let badgeElement;

    switch (rank) {
        case 1:
            badgeElement = (
                <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center">
                    <Medal size={18} weight="bold" className="text-black" />
                </div>
            );
            break;
        case 2:
            badgeElement = (
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                    <Medal size={18} weight="bold" className="text-black" />
                </div>
            );
            break;
        case 3:
            badgeElement = (
                <div className="w-8 h-8 rounded-full bg-amber-700 flex items-center justify-center">
                    <Medal size={18} weight="bold" className="text-black" />
                </div>
            );
            break;
        default:
            badgeElement = (
                <div className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center">
                    <span className="text-text-secondary font-medium">{rank}</span>
                </div>
            );
    }

    return badgeElement;
}
