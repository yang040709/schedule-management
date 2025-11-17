// utils/eventBus.ts
import mitt, { type Emitter } from 'mitt'
import type { Events } from '@/types/events'

const eventBus: Emitter<Events> = mitt<Events>()

export default eventBus
