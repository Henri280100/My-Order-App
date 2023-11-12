/**
 * What is this queue uses for?
 * Well... this queue is ultimately useful for:
 * 1) Job scheduling; can be used to schedule a job to send an email or to process a payment.
 * 2) Message passing: Can be used to pass messages between a web server and a db.
 * 3) Data buffering: Can be used to buffer data from a sensor or from a network connection.
 */
class QueueUtils {
	private readonly queue: any[] = [];
	constructor() {}

	/**
	 * Adds a job to the queue
	 * @param {object} job the job to add to the queue.
	 */
	addJob(job: any): void {
		this.queue.push(job);
	}

	/**
	 * Process jobs from the queue
	 * @param {function} callback the callback function to call for each job.
	 */
	processJobs(callback: (job: any) => void): void {
		while (this.queue.length > 0) {
			const job = this.queue.shift();
			callback(job);
		}
	}

	/**
	 * Gets a job from the queue
	 * @param {string} jobId the ID of the job to get.
	 * @returns {object|undefined} The job
	 */
	getJob(jobId: string): any | undefined {
		return this.queue.find((j) => j._id === jobId);
	}

	/**
	 * Removes a job from the queue.
	 * @param {string} jobId the Id of the job to remove.
	 */
	removeJob(jobId: string): void {
		const index = this.queue.findIndex((j) => j._id === jobId);
		if (index >= 0) {
			this.queue.splice(index, 1);
		}
	}

	/**
	 * Gets all the jobs from the queue.
	 * @returns {object[]} An array of all jobs in the queue.
	 */
	getJobs(): any[] {
		return this.queue;
	}

	/**
	 * Gets statistics about the queue.
	 * @returns {object} An object containing statistics about the queue.
	 */
	getStats(): any {
		return {
			queueLength: this.queue.length,
		};
	}
}

const queueUtils = new QueueUtils();
export default queueUtils;
