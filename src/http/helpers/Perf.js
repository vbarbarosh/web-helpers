class Perf
{
    #end = null;
    #checkpoints = [];

    checkpoint(message) {
        if (this.#end !== null) {
            throw new Error('Perf was ended');
        }
        this.#checkpoints.push({message, hrtime: process.hrtime.bigint()});
    }

    end() {
        if (this.#end !== null) {
            throw new Error('Perf was ended');
        }
        this.#end = process.hrtime.bigint();
    }

    toJSON() {
        const hrtime = this.#checkpoints.map(v => v.hrtime);
        hrtime.push(this.#end ?? process.hrtime.bigint());
        return this.#checkpoints.map(function ({message}, i) {
            return [(Number(hrtime[i + 1] - hrtime[i])/1E9).toFixed(4) + 's', message];
        });
    }
}

module.exports = Perf;
