import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
    memoryPurged,
    selectHistoryIds,
    selectClipLimit,
    selectLayout,
    selectProviders
} from '../../features/clips/clipQueueSlice';
import {
    selectDisabledCategory,
    selectChannel,
    selectCommandPrefix,
    settingsChanged
} from '../../features/settings/settingsSlice';
import {
    Gear,
    History,
    Monitor,
    CaretRight,
    X,
    Trash
} from 'phosphor-react';
import Button from '../ui/Button';

export default function SettingsModal({ onClose }) {
    const dispatch = useAppDispatch();
    const channel = useAppSelector(selectChannel);
    const commandPrefix = useAppSelector(selectCommandPrefix);
    const clipLimit = useAppSelector(selectClipLimit);
    const enabledProviders = useAppSelector(selectProviders);
    const layout = useAppSelector(selectLayout);
    const historyIds = useAppSelector(selectHistoryIds);
    const disabledCategory = useAppSelector(selectDisabledCategory);

    const [activeTab, setActiveTab] = useState('general');
    const [formData, setFormData] = useState({
        channel: channel || '',
        commandPrefix: commandPrefix || '!queue',
        clipLimit: clipLimit === null ? '' : clipLimit,
        layout: layout || 'classic',
        enabledProviders: enabledProviders || ['twitch-clip', 'twitch-vod', 'youtube'],
        disabledCategory: disabledCategory || []
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleNumberChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value === '' ? '' : Number(value) });
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        const [group, value] = name.split(':');

        if (group === 'providers') {
            const providers = checked
                ? [...formData.enabledProviders, value]
                : formData.enabledProviders.filter(p => p !== value);

            setFormData({ ...formData, enabledProviders: providers });
        } else if (group === 'categories') {
            const categories = checked
                ? [...formData.disabledCategory, value]
                : formData.disabledCategory.filter(c => c !== value);

            setFormData({ ...formData, disabledCategory: categories });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        dispatch(settingsChanged({
            channel: formData.channel,
            commandPrefix: formData.commandPrefix,
            clipLimit: formData.clipLimit === '' ? null : formData.clipLimit,
            layout: formData.layout,
            enabledProviders: formData.enabledProviders,
            disabledCategory: formData.disabledCategory
        }));

        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-surface rounded-lg max-w-3xl w-full max-h-[90vh] overflow-hidden">
                <div className="flex justify-between items-center p-4 border-b border-border">
                    <h2 className="text-xl font-bold text-white">Settings</h2>
                    <button
                        className="p-1 hover:bg-card rounded-full"
                        onClick={onClose}
                    >
                        <X size={24} className="text-text-secondary" />
                    </button>
                </div>

                <div className="flex h-[calc(90vh-4rem)]">
                    <div className="w-48 bg-card p-2 space-y-1">
                        <TabButton
                            icon={<Gear size={18} />}
                            label="General"
                            active={activeTab === 'general'}
                            onClick={() => setActiveTab('general')}
                        />
                        <TabButton
                            icon={<Monitor size={18} />}
                            label="Clip Queue"
                            active={activeTab === 'queue'}
                            onClick={() => setActiveTab('queue')}
                        />
                        <TabButton
                            icon={<History size={18} />}
                            label="Clip Memory"
                            active={activeTab === 'memory'}
                            onClick={() => setActiveTab('memory')}
                        />
                    </div>

                    <form className="flex-1 p-6 overflow-y-auto" onSubmit={handleSubmit}>
                        {activeTab === 'general' && (
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-text-primary mb-2">
                                        Twitch Channel
                                    </label>
                                    <input
                                        type="text"
                                        name="channel"
                                        value={formData.channel}
                                        onChange={handleInputChange}
                                        className="w-full bg-card border border-border rounded-md px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="Channel name"
                                        required
                                    />
                                    <p className="text-text-secondary text-xs mt-1">
                                        Twitch chat channel to join
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-text-primary mb-2">
                                        Command Prefix
                                    </label>
                                    <input
                                        type="text"
                                        name="commandPrefix"
                                        value={formData.commandPrefix}
                                        onChange={handleInputChange}
                                        className="w-full bg-card border border-border rounded-md px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="!queue"
                                        required
                                    />
                                    <p className="text-text-secondary text-xs mt-1">
                                        Prefix for chat commands, which can be used by moderators
                                    </p>
                                    <p className="text-text-secondary text-xs mt-2">
                                        Example commands: <code className="bg-card px-1 py-0.5 rounded">{formData.commandPrefix}open</code>,{' '}
                                        <code className="bg-card px-1 py-0.5 rounded">{formData.commandPrefix}next</code>
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-text-primary mb-2">
                                        Disabled Categories
                                    </label>
                                    <div className="space-y-2">
                                        <CheckboxItem
                                            id="category-art"
                                            name="categories:509660"
                                            label="Art"
                                            checked={formData.disabledCategory.includes('509660')}
                                            onChange={handleCheckboxChange}
                                        />
                                        <CheckboxItem
                                            id="category-hottubs"
                                            name="categories:116747788"
                                            label="Hot Tubs"
                                            checked={formData.disabledCategory.includes('116747788')}
                                            onChange={handleCheckboxChange}
                                        />
                                        <CheckboxItem
                                            id="category-asmr"
                                            name="categories:509659"
                                            label="ASMR"
                                            checked={formData.disabledCategory.includes('509659')}
                                            onChange={handleCheckboxChange}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'queue' && (
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-text-primary mb-2">
                                        Queue Layout
                                    </label>
                                    <select
                                        name="layout"
                                        value={formData.layout}
                                        onChange={handleInputChange}
                                        className="w-full bg-card border border-border rounded-md px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                                    >
                                        <option value="classic">Classic</option>
                                        <option value="spotlight">Spotlight</option>
                                        <option value="fullscreen">Fullscreen with popup (experimental)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-text-primary mb-2">
                                        Clip Providers
                                    </label>
                                    <div className="space-y-2">
                                        <CheckboxItem
                                            id="provider-twitch-clip"
                                            name="providers:twitch-clip"
                                            label="Twitch Clips"
                                            checked={formData.enabledProviders.includes('twitch-clip')}
                                            onChange={handleCheckboxChange}
                                        />
                                        <CheckboxItem
                                            id="provider-twitch-vod"
                                            name="providers:twitch-vod"
                                            label="Twitch Videos / VODs"
                                            checked={formData.enabledProviders.includes('twitch-vod')}
                                            onChange={handleCheckboxChange}
                                        />
                                        <CheckboxItem
                                            id="provider-youtube"
                                            name="providers:youtube"
                                            label="YouTube"
                                            checked={formData.enabledProviders.includes('youtube')}
                                            onChange={handleCheckboxChange}
                                        />
                                        <CheckboxItem
                                            id="provider-streamable"
                                            name="providers:streamable"
                                            label="Streamable"
                                            checked={formData.enabledProviders.includes('streamable')}
                                            onChange={handleCheckboxChange}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-text-primary mb-2">
                                        Clip Limit
                                    </label>
                                    <input
                                        type="number"
                                        name="clipLimit"
                                        value={formData.clipLimit}
                                        onChange={handleNumberChange}
                                        min="0"
                                        step="1"
                                        className="w-full bg-card border border-border rounded-md px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="No limit"
                                    />
                                    <p className="text-text-secondary text-xs mt-1">
                                        Max number of clips in the queue. Afterwards new clips will not be accepted, current clips can be boosted
                                        to the top of the queue. You can <em>Skip</em> a clip instead of <em>Next</em>-ing it to free a spot.
                                        <br />
                                        Leave empty or 0 to disable.
                                    </p>
                                </div>
                            </div>
                        )}

                        {activeTab === 'memory' && (
                            <div className="space-y-6">
                                <p className="text-text-secondary">
                                    Here, soon, you'll be able to setup for how long watched clips should be remembered before they can be
                                    added to the queue again. As well as change other clip memory related settings.
                                </p>

                                <div className="bg-card p-4 rounded-md">
                                    <div className="flex justify-between items-center">
                                        <p className="text-text-primary">
                                            You have {historyIds.length} clips in permanent memory
                                        </p>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            leftIcon={<Trash size={16} />}
                                            onClick={() => dispatch(memoryPurged())}
                                        >
                                            Purge memory
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="mt-8 flex justify-end space-x-3">
                            <Button
                                variant="secondary"
                                onClick={onClose}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                            >
                                Save
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

function TabButton({ icon, label, active, onClick }) {
    return (
        <button
            type="button"
            className={`
        w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm
        ${active ? 'bg-primary text-white' : 'text-text-secondary hover:bg-card hover:text-white'}
        transition-colors
      `}
            onClick={onClick}
        >
            {icon}
            <span>{label}</span>
            {active && <CaretRight size={16} className="ml-auto" />}
        </button>
    );
}

function CheckboxItem({ id, name, label, checked, onChange }) {
    return (
        <label htmlFor={id} className="flex items-center gap-2 cursor-pointer">
            <input
                type="checkbox"
                id={id}
                name={name}
                checked={checked}
                onChange={onChange}
                className="w-4 h-4 rounded bg-card border-border text-primary focus:ring-primary focus:ring-offset-0"
            />
            <span className="text-text-primary">{label}</span>
        </label>
    );
}
