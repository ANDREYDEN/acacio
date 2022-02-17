export function snakeCaseToPascalCase(input: string): string {
    return input
        .split('_')
        .map(word => word[0].toUpperCase() + word.substring(1))
        .join(' ')
}