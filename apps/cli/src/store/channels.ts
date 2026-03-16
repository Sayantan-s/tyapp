import { create } from 'zustand';

interface Channel {
  name: string;
  online: number;
  joined: boolean;
}

interface ChannelState {
  channels: Channel[];
  activeChannel: string;
  setActiveChannel: (name: string) => void;
  setChannels: (channels: Channel[]) => void;
  addChannel: (channel: Channel) => void;
}

export const useChannelStore = create<ChannelState>((set) => ({
  channels: [
    { name: 'general', online: 0, joined: true },
  ],
  activeChannel: 'general',
  setActiveChannel: (name) => set({ activeChannel: name }),
  setChannels: (channels) => set({ channels }),
  addChannel: (channel) =>
    set((state) => ({ channels: [...state.channels, channel] })),
}));
